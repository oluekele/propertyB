import mongoose from "mongoose";
import { seedAdminUser } from "../utils/seedAmin"; // adjust path if needed

let isConnected = false;
let seeded = false;

export async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing!");
    throw new Error("MONGO_URI not set");
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
    });

    isConnected = true;
    console.log("✅ MongoDB connected");

    if (!seeded) {
      console.log("🌱 Seeding admin user...");
      try {
        await seedAdminUser();
        seeded = true;
        console.log("✅ Admin user seeded");
      } catch (seedErr) {
        console.error("❌ Seeding admin user failed:", seedErr);
      }
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err; // rethrow so Vercel logs it
  }
}
