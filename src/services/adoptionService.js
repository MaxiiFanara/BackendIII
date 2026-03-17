import adoptionDAO from '../daos/adoption.dao.js';
import userDAO from '../daos/user.dao.js';
import petDAO from '../daos/pet.dao.js';
import logger from '../config/logger.config.js';

class AdoptionService {
  async getAllAdoptions() {
    try {
      return await adoptionDAO.findAll();
    } catch (error) {
      logger.error('Error en getAllAdoptions service', { error: error.message });
      throw error;
    }
  }

  async getAdoptionById(id) {
    try {
      const adoption = await adoptionDAO.findById(id);
      if (!adoption) {
        const err = new Error('Adopción no encontrada');
        err.statusCode = 404;
        throw err;
      }
      return adoption;
    } catch (error) {
      logger.error('Error en getAdoptionById service', { error: error.message });
      throw error;
    }
  }

  async createAdoption(uid, pid) {
    try {
      const user = await userDAO.findById(uid);
      if (!user) {
        const err = new Error('Usuario no encontrado');
        err.statusCode = 404;
        throw err;
      }

      const pet = await petDAO.findById(pid);
      if (!pet) {
        const err = new Error('Mascota no encontrada');
        err.statusCode = 404;
        throw err;
      }

      if (pet.owner) {
        const err = new Error('La mascota ya tiene dueño');
        err.statusCode = 400;
        throw err;
      }

      // Asignar owner a la mascota
      await petDAO.update(pid, { owner: uid });

      // Agregar mascota al array del usuario
      user.pets.push(pid);
      await userDAO.update(uid, { pets: user.pets });

      // Registrar la adopción
      const adoption = await adoptionDAO.create({ owner: uid, pet: pid });

      logger.info('Adopción creada', { adoptionId: adoption._id, uid, pid });
      return adoption;
    } catch (error) {
      logger.error('Error en createAdoption service', { error: error.message });
      throw error;
    }
  }
}

export default new AdoptionService();
