import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import router from './routes/auth.routes';
import routes from './routes/property.routes';
import { seedAdminUser } from './utils/seedAmin';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/properties', routes);
app.use('/api/auth', router);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // 👇 Seed admin user
    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
