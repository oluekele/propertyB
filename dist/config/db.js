"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const seedAmin_1 = require("../utils/seedAmin");
let isConnected = false;
let seeded = false;
async function connectDB() {
    console.log("🔄 connectDB() called");
    console.log("MONGO_URI present?", !!process.env.MONGO_URI);
    if (isConnected) {
        console.log("✅ Already connected to Mongo");
        return;
    }
    if (!process.env.MONGO_URI) {
        console.error("❌ MONGO_URI is missing!");
        throw new Error("MONGO_URI not set");
    }
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 3000, // fail fast if cannot connect
        });
        isConnected = true;
        console.log("✅ MongoDB connected");
        if (!seeded) {
            console.log("🌱 Seeding admin user...");
            try {
                await (0, seedAmin_1.seedAdminUser)();
                seeded = true;
                console.log("✅ Admin user seeded");
            }
            catch (seedErr) {
                console.error("❌ Seeding admin user failed:", seedErr);
            }
        }
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
}
