import mongoose from 'mongoose';
import { env } from '../../env';

export async function connectMongo(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URL);

    console.info('MongoDB conectado com sucesso');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB', error);
    process.exit(1);
  }
}