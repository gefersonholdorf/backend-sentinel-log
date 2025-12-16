import mongoose from 'mongoose';
import { env } from '../../env';

export async function connectMongo(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URL);

    console.info('MongoDB connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB.', error);
    process.exit(1);
  }
}