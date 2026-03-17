import { petModel } from '../models/Pet.js';
import logger from '../config/logger.config.js';

class PetDAO {
  constructor(model) {
    this.model = model;
  }

  async create(petData) {
    try {
      return await this.model.create(petData);
    } catch (error) {
      logger.error('Error al crear mascota', { error: error.message });
      throw new Error(`Error al crear mascota: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.model.find().populate('owner');
    } catch (error) {
      logger.error('Error al obtener mascotas', { error: error.message });
      throw new Error(`Error al obtener mascotas: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id).populate('owner');
    } catch (error) {
      logger.error('Error al obtener mascota por ID', { error: error.message });
      throw new Error(`Error al obtener mascota: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      logger.error('Error al actualizar mascota', { error: error.message });
      throw new Error(`Error al actualizar mascota: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error al eliminar mascota', { error: error.message });
      throw new Error(`Error al eliminar mascota: ${error.message}`);
    }
  }

  async deleteAll() {
    try {
      return await this.model.deleteMany({});
    } catch (error) {
      logger.error('Error al eliminar mascotas', { error: error.message });
      throw new Error(`Error al eliminar mascotas: ${error.message}`);
    }
  }
}

export default new PetDAO(petModel);