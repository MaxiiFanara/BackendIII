import userDAO from '../daos/user.dao.js';
import { hashPassword } from '../utils/hash.util.js';
import logger from '../config/logger.config.js';

class UserService {
  async createUser(userData) {
    try {
      const existingUser = await userDAO.findByEmail(userData.email);
      if (existingUser) {
        const err = new Error('El email ya está registrado');
        err.statusCode = 400;
        throw err;
      }
      userData.password = await hashPassword(userData.password);
      return await userDAO.create(userData);
    } catch (error) {
      logger.error('Error en createUser service', { error: error.message });
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await userDAO.findAll();
    } catch (error) {
      logger.error('Error en getAllUsers service', { error: error.message });
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await userDAO.findById(id);
      if (!user) {
        const err = new Error('Usuario no encontrado');
        err.statusCode = 404;
        throw err;
      }
      return user;
    } catch (error) {
      logger.error('Error en getUserById service', { error: error.message });
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      const user = await userDAO.findById(id);
      if (!user) {
        const err = new Error('Usuario no encontrado');
        err.statusCode = 404;
        throw err;
      }
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }
      return await userDAO.update(id, updateData);
    } catch (error) {
      logger.error('Error en updateUser service', { error: error.message });
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await userDAO.findById(id);
      if (!user) {
        const err = new Error('Usuario no encontrado');
        err.statusCode = 404;
        throw err;
      }
      return await userDAO.delete(id);
    } catch (error) {
      logger.error('Error en deleteUser service', { error: error.message });
      throw error;
    }
  }
}

export default new UserService();
