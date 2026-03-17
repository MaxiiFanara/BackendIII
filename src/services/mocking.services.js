import { generateUsers, generatePets } from '../utils/mockGenerators.js';
import userDAO from '../daos/user.dao.js';
import petDAO from '../daos/pet.dao.js';
import logger from '../config/logger.config.js';

class MockingService {
  async generateMockUsers(count) {
    try {
      return await generateUsers(count);
    } catch (error) {
      logger.error('Error generando usuarios mock', { error: error.message });
      throw error;
    }
  }

  async generateMockPets(count) {
    try {
      return generatePets(count);
    } catch (error) {
      logger.error('Error generando mascotas mock', { error: error.message });
      throw error;
    }
  }

 async insertMockData(usersCount, petsCount) {
  try {
    const users = await this.generateMockUsers(usersCount);
    const pets = await this.generateMockPets(petsCount); 

    const insertedUsers = [];
    for (const user of users) {
      try {
        const inserted = await userDAO.create(user);
        insertedUsers.push(inserted);
      } catch (error) {
        logger.warn('Usuario duplicado, omitiendo', { email: user.email });
      }
    }

    const insertedPets = [];
    for (const pet of pets) {
      const inserted = await petDAO.create(pet);
      insertedPets.push(inserted);
    }

    logger.info('Datos mock insertados', { 
      users: insertedUsers.length, 
      pets: insertedPets.length 
    });

    return {
      users: insertedUsers,
      pets: insertedPets
    };
  } catch (error) {
    logger.error('Error insertando datos mock', { error: error.message });
    throw error;
  }
}
}

export default new MockingService();