import petDAO from '../daos/pet.dao.js';
import logger from '../config/logger.config.js';

class PetService {
  async getAllPets() {
    try {
      return await petDAO.findAll();
    } catch (error) {
      logger.error('Error en getAllPets service', { error: error.message });
      throw error;
    }
  }

  async getPetById(id) {
    try {
      const pet = await petDAO.findById(id);
      if (!pet) {
        const err = new Error('Mascota no encontrada');
        err.statusCode = 404;
        throw err;
      }
      return pet;
    } catch (error) {
      logger.error('Error en getPetById service', { error: error.message });
      throw error;
    }
  }

  async createPet(petData) {
    try {
      return await petDAO.create(petData);
    } catch (error) {
      logger.error('Error en createPet service', { error: error.message });
      throw error;
    }
  }

  async updatePet(id, updateData) {
    try {
      const pet = await petDAO.findById(id);
      if (!pet) {
        const err = new Error('Mascota no encontrada');
        err.statusCode = 404;
        throw err;
      }
      return await petDAO.update(id, updateData);
    } catch (error) {
      logger.error('Error en updatePet service', { error: error.message });
      throw error;
    }
  }

  async deletePet(id) {
    try {
      const pet = await petDAO.findById(id);
      if (!pet) {
        const err = new Error('Mascota no encontrada');
        err.statusCode = 404;
        throw err;
      }
      await petDAO.delete(id);
    } catch (error) {
      logger.error('Error en deletePet service', { error: error.message });
      throw error;
    }
  }
}

export default new PetService();
