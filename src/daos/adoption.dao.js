import { adoptionModel } from '../models/Adoption.js';
import logger from '../config/logger.config.js';

class AdoptionDAO {
  constructor(model) {
    this.model = model;
  }

  async create(adoptionData) {
    try {
      return await this.model.create(adoptionData);
    } catch (error) {
      logger.error('Error al crear adopción', { error: error.message });
      throw new Error(`Error al crear adopción: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.model.find().populate('owner', '-password').populate('pet');
    } catch (error) {
      logger.error('Error al obtener adopciones', { error: error.message });
      throw new Error(`Error al obtener adopciones: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id).populate('owner', '-password').populate('pet');
    } catch (error) {
      logger.error('Error al obtener adopción por ID', { error: error.message });
      throw new Error(`Error al obtener adopción: ${error.message}`);
    }
  }
}

export default new AdoptionDAO(adoptionModel);
