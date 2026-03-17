import app from './app.js';
import { connectDB } from './db/mongodb/connection.js';
import { config } from './config/env.config.js';
import logger from './config/logger.config.js';

const startServer = async () => {
  try {
    await connectDB();
   
    app.listen(config.port, () => {
      logger.info(`Servidor corriendo en puerto ${config.port}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor', { error: error.message });
    process.exit(1);
  }
};

startServer();