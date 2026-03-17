import mockingService from '../services/mocking.services.js';
import userService from '../services/UserService.js';
import petService from '../services/petService.js';
import logger from '../config/logger.config.js';

class MocksController {
 async getMockingPets(req, res, next) {
  try {
    const pets = await mockingService.generateMockPets(100); // ← Faltaba await
    logger.info('Mascotas mock generadas', { count: pets.length });
    res.status(200).json({
      status: 'success',
      payload: pets
    });
  } catch (error) {
    next(error);
  }
}

  async getMockingUsers(req, res, next) {
    try {
      const users = await mockingService.generateMockUsers(50);
      logger.info('Usuarios mock generados', { count: users.length });
      res.status(200).json({
        status: 'success',
        payload: users
      });
    } catch (error) {
      next(error);
    }
  }

  async generateData(req, res, next) {
    try {
      const { users, pets } = req.body;
      const result = await mockingService.insertMockData(users, pets);
      
      logger.info('Datos generados e insertados', { 
        usersInserted: result.users.length, 
        petsInserted: result.pets.length 
      });

      res.status(201).json({
        status: 'success',
        message: 'Datos generados e insertados correctamente',
        payload: {
          usersInserted: result.users.length,
          petsInserted: result.pets.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        status: 'success',
        payload: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getPets(req, res, next) {
    try {
      const pets = await petService.getAllPets();
      res.status(200).json({
        status: 'success',
        payload: pets
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MocksController();