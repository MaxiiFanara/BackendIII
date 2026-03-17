import mongoose from 'mongoose';
import { config } from '../../config/env.config.js';
import logger from '../../config/logger.config.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('MongoDB conectado');
  } catch (error) {
    logger.error('Error conectando a MongoDB', { error: error.message });
    process.exit(1);
  }
};