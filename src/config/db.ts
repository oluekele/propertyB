import mongoose from "mongoose";
import { seedAdminUser } from "../utils/seedAmin"; // adjust path if needed

let isConnected = false;
let seeded = false;

export async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("✅ MongoDB connected");

  if (!seeded) {
    await seedAdminUser();
    seeded = true;
  }
}
