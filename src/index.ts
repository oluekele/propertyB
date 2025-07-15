import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import { connectDB } from "./config/db"; // ✅ DB util

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://property-f.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Quick test route (does NOT depend on DB)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    node_env: process.env.NODE_ENV || "undefined",
    mongo_uri_present: !!process.env.MONGO_URI,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Lazy DB connection middleware (only when needed)
async function ensureDBConnection(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    await connectDB(); // Will connect only once per cold start
    next();
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    return res.status(500).json({ error: "Database connection failed" });
  }
}

// ✅ Protect DB routes with connection check
app.use("/api/auth", ensureDBConnection, authRoutes);
app.use("/api/properties", ensureDBConnection, propertyRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Debug logs
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI present?", !!process.env.MONGO_URI);

// ✅ Local dev only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB().catch((err) => console.error("❌ DB connection error at startup:", err));
  app.listen(PORT, () => console.log(`🚀 Local server running at http://localhost:${PORT}`));
}

// ✅ Export for Vercel
export const handler = serverless(app);
