import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

export const seedAdminUser = async () => {
  // Check if an admin user already exists
  const existingAdmin = await User.findOne({ isAdmin: true });
  if (existingAdmin) return; // Exit if an admin already exists

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.create({
    name: 'Admin User',
    email: 'ekeleolu1@gmail.com',
    password: hashedPassword,
    isAdmin: true,
  });

  console.log('✅ Static admin account created.');
};
