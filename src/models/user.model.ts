import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});


export const User = model('User', UserSchema);
