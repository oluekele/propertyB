import { Schema, model } from 'mongoose';

const PropertySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  price: { type: String },
  location: { type: String },
  beds: Number,
  baths: Number,
  size: String,
  category: { type: String, required: true },
  image: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Property = model('Property', PropertySchema);
