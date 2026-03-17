import { userModel } from '../models/User.js';
import logger from '../config/logger.config.js';

class UserDAO {
  constructor(model) {
    this.model = model;
  }

  async create(userData) {
    try {
      return await this.model.create(userData);
    } catch (error) {
      logger.error('Error al crear usuario', { error: error.message });
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.model.find().populate('pets');
    } catch (error) {
      logger.error('Error al obtener usuarios', { error: error.message });
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id).populate('pets');
    } catch (error) {
      logger.error('Error al obtener usuario por ID', { error: error.message });
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      logger.error('Error al obtener usuario por email', { error: error.message });
      throw new Error(`Error al obtener usuario por email: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      logger.error('Error al actualizar usuario', { error: error.message });
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error al eliminar usuario', { error: error.message });
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async deleteAll() {
    try {
      return await this.model.deleteMany({});
    } catch (error) {
      logger.error('Error al eliminar usuarios', { error: error.message });
      throw new Error(`Error al eliminar usuarios: ${error.message}`);
    }
  }
}

export default new UserDAO(userModel);