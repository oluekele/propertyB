import { Request, Response } from 'express';
import { Property } from '../models/property.model';
import { AuthRequest } from '../middleware/auth.middleware';
import slugify from 'slugify';
import mongoose from 'mongoose';

export const getProperties = async (_req: Request, res: Response) => {
  const data = await Property.find();
  res.json(data);
};

export const getProperty = async (req: Request, res: Response) => {
  const data = await Property.findById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
};

export const getPropertyBySlug = async (req: Request, res:Response) => {
  const { slug } = req.params;
  try {
    const property = await Property.findOne({ slug });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property by slug:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, location, beds, baths, size, category } = req.body;

    // Debug log incoming request
    console.log("Incoming createProperty request:");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const slug = slugify(title, { lower: true });

    const newProperty = new Property({
      title,
      slug,
      description,
      price,
      location,
      beds: Number(beds),
      baths: Number(baths),
      size,
      category,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.user?.id,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err: any) {
    console.error("❌ Create Property Error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};



// export const createProperty = async (req: AuthRequest, res: Response) => {
//   try {
//     const {
//       title,
//       description,
//       price,
//       location,
//       beds,
//       baths,
//       size,
//       category,
//     } = req.body;

//     // Check for required fields
//     if (!title || !category) {
//       return res.status(400).json({ message: 'Title and category are required.' });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: 'Image is required.' });
//     }

//     const slug = slugify(title, { lower: true });

//     const newProperty = new Property({
//       title,
//       slug,
//       description,
//       price,
//       location,
//       beds,
//       baths,
//       size,
//       category,
//       image: `/uploads/${req.file.filename}`,
//       createdBy: req.user.id,
//     });

//     await newProperty.save();
//     res.status(201).json(newProperty);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Create failed', error: err });
//   }
// };

// export const updateProperty = async (req: AuthRequest, res: Response) => {
//   try {
//     const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    
//     const updated = await Property.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         ...(image ? { image } : {}),
//       },
//       { new: true }
//     );
//     console.log('Received file:', req.file);
//     console.log('Received body:', req.body);
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: 'Update failed' });
//   }
// };

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    console.log("Incoming updateProperty request:");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const updatedData: Record<string, any> = { ...req.body };

    // Update slug if title changes
    if (updatedData.title) {
      updatedData.slug = slugify(updatedData.title, { lower: true });
    }

    if (updatedData.price) updatedData.price = String(updatedData.price);
    if (updatedData.beds) updatedData.beds = Number(updatedData.beds);
    if (updatedData.baths) updatedData.baths = Number(updatedData.baths);

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Property.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(updated);
  } catch (err: any) {
    console.error("❌ Update Property Error:", err.message);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
