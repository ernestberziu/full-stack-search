import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  await import('./db/startAndSeedMemoryDB');
}

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

if (!process.env.DB_NAME) throw new Error('DB_NAME is not set');
const DB_NAME = process.env.DB_NAME;

mongoose
  .connect(DATABASE_URL, {
    dbName: DB_NAME,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));
