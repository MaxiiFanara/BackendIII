import express from 'express';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './config/logger.config.js';
import { swaggerSpec, swaggerUi } from './config/swagger.config.js';

// Routers
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import adoptionRouter from './routes/adoption.router.js';
import petsRouter from './routes/pets.router.js';

const app = express();

app.use(compression({
  brotli: { enabled: true, zlib: {} }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/adoptions', adoptionRouter);
app.use('/api/pets', petsRouter);

app.use(errorHandler);

export default app;
