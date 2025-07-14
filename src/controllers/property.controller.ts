import { Request, Response } from 'express';
import { Property } from '../models/property.model';
import { AuthRequest } from '../middleware/auth.middleware';
import slugify from 'slugify';

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
    const {
      title,
      description,
      price,
      location,
      beds,
      baths,
      size,
      category,
    } = req.body;

    // Check for required fields
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required.' });
    }

    const slug = slugify(title, { lower: true });

    const newProperty = new Property({
      title,
      slug,
      description,
      price,
      location,
      beds,
      baths,
      size,
      category,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create failed', error: err });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(image ? { image } : {}),
      },
      { new: true }
    );
    console.log('Received file:', req.file);
    console.log('Received body:', req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
