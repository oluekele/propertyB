"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyBySlug = exports.getProperty = exports.getProperties = void 0;
const property_model_1 = require("../models/property.model");
const slugify_1 = __importDefault(require("slugify"));
const getProperties = async (_req, res) => {
    const data = await property_model_1.Property.find();
    res.json(data);
};
exports.getProperties = getProperties;
const getProperty = async (req, res) => {
    const data = await property_model_1.Property.findById(req.params.id);
    if (!data)
        return res.status(404).json({ message: 'Not found' });
    res.json(data);
};
exports.getProperty = getProperty;
const getPropertyBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const property = await property_model_1.Property.findOne({ slug });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    }
    catch (error) {
        console.error('Error fetching property by slug:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getPropertyBySlug = getPropertyBySlug;
const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, beds, baths, size, category, } = req.body;
        // Check for required fields
        if (!title || !category) {
            return res.status(400).json({ message: 'Title and category are required.' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required.' });
        }
        const slug = (0, slugify_1.default)(title, { lower: true });
        const newProperty = new property_model_1.Property({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Create failed', error: err });
    }
};
exports.createProperty = createProperty;
const updateProperty = async (req, res) => {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;
        const updated = await property_model_1.Property.findByIdAndUpdate(req.params.id, {
            ...req.body,
            ...(image ? { image } : {}),
        }, { new: true });
        console.log('Received file:', req.file);
        console.log('Received body:', req.body);
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ message: 'Update failed' });
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    await property_model_1.Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};
exports.deleteProperty = deleteProperty;
