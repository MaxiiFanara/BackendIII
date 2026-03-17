import petService from '../services/petService.js';
import logger from '../config/logger.config.js';

class PetsController {
  async getAllPets(req, res, next) {
    try {
      const pets = await petService.getAllPets();
      res.status(200).json({ status: 'success', payload: pets });
    } catch (error) {
      next(error);
    }
  }

  async getPetById(req, res, next) {
    try {
      const pet = await petService.getPetById(req.params.pid);
      res.status(200).json({ status: 'success', payload: pet });
    } catch (error) {
      next(error);
    }
  }

  async createPet(req, res, next) {
    try {
      const pet = await petService.createPet(req.body);
      logger.info('Mascota creada', { petId: pet._id });
      res.status(201).json({ status: 'success', payload: pet });
    } catch (error) {
      next(error);
    }
  }

  async updatePet(req, res, next) {
    try {
      const pet = await petService.updatePet(req.params.pid, req.body);
      logger.info('Mascota actualizada', { petId: pet._id });
      res.status(200).json({ status: 'success', payload: pet });
    } catch (error) {
      next(error);
    }
  }

  async deletePet(req, res, next) {
    try {
      await petService.deletePet(req.params.pid);
      logger.info('Mascota eliminada', { petId: req.params.pid });
      res.status(200).json({ status: 'success', message: 'Mascota eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

export default new PetsController();
