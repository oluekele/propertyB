import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import { connectDB } from "./config/db";  // ✅ import DB util

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://property-f.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "Serverless is working ✅" });
});


console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI present?", !!process.env.MONGO_URI);

connectDB().catch((err) => console.error("❌ DB connection error at startup:", err));

// ✅ Local dev only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server at http://localhost:${PORT}`));
}

// ✅ Export for Vercel
export const handler = serverless(app);
