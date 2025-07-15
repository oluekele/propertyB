import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';

import router from './routes/auth.routes';
import routes from './routes/property.routes';
import { seedAdminUser } from './utils/seedAmin';

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://property-f.vercel.app'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/properties', routes);
app.use('/api/auth', router);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ DB connection (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('✅ MongoDB connected');
  await seedAdminUser();
  isConnected = true;
};

// ✅ Connect at startup
connectDB();

const PORT = process.env.PORT || 5000;

// ✅ Only listen when running locally (not in Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}

// ✅ Export for Vercel
export const handler = serverless(app);
