import mongoose from 'mongoose';
import logger from '../config/logger.config.js';

export const validateGenerateData = (req, res, next) => {
  const { users, pets } = req.body;

  if (!users || !pets) {
    logger.warn('Parámetros faltantes en /generateData', { body: req.body });
    return res.status(400).json({
      status: 'error',
      message: 'Todos los parámetros son obligatorios'
    });
  }

  if (typeof users !== 'number' || typeof pets !== 'number') {
    logger.warn('Parámetros inválidos en /generateData', { users, pets });
    return res.status(400).json({
      status: 'error',
      message: 'Los parámetros "users" y "pets" deben ser números'
    });
  }

  if (users < 0 || pets < 0) {
    logger.warn('Parámetros negativos en /generateData', { users, pets });
    return res.status(400).json({
      status: 'error',
      message: 'Los parámetros deben ser mayores o iguales a 0'
    });
  }

  next();
};

export const validateMongoId = (req, res, next) => {
  const ids = req.params;
  for (const [key, value] of Object.entries(ids)) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      logger.warn('Formato de ID inválido', { [key]: value });
      return res.status(400).json({
        status: 'error',
        message: `Formato de ID inválido para el parámetro: ${key}`
      });
    }
  }
  next();
};

export const validateUserCreate = (req, res, next) => {
  let { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    logger.warn('Campos faltantes al crear usuario', { body: req.body });
    return res.status(400).json({
      status: 'error',
      message: 'Todos los campos son obligatorios'
    });
  }

  req.body.email = String(email).trim().toLowerCase();

  next();
};

export const validatePetCreate = (req, res, next) => {
  const { name, specie } = req.body;

  if (!name || !specie) {
    logger.warn('Campos faltantes al crear mascota', { body: req.body });
    return res.status(400).json({
      status: 'error',
      message: 'Todos los campos son obligatorios'
    });
  }

  next();
};
