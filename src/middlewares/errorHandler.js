import logger from '../config/logger.config.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error capturado por errorHandler', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};