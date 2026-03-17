import adoptionService from '../services/adoptionService.js';
import logger from '../config/logger.config.js';

class AdoptionsController {
  async getAllAdoptions(req, res, next) {
    try {
      const adoptions = await adoptionService.getAllAdoptions();
      res.status(200).json({ status: 'success', payload: adoptions });
    } catch (error) {
      next(error);
    }
  }

  async getAdoptionById(req, res, next) {
    try {
      const adoption = await adoptionService.getAdoptionById(req.params.aid);
      res.status(200).json({ status: 'success', payload: adoption });
    } catch (error) {
      next(error);
    }
  }

  async createAdoption(req, res, next) {
    try {
      const { uid, pid } = req.params;
      const adoption = await adoptionService.createAdoption(uid, pid);
      logger.info('Adopción registrada', { adoptionId: adoption._id });
      res.status(201).json({
        status: 'success',
        message: 'Mascota adoptada correctamente',
        payload: adoption
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdoptionsController();
