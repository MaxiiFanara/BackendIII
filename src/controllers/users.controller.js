import userService from '../services/UserService.js';
import logger from '../config/logger.config.js';

class UsersController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.uid);
      res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      logger.info('Usuario creado', { userId: user._id });
      res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.uid, req.body);
      logger.info('Usuario actualizado', { userId: user._id });
      res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.uid);
      logger.info('Usuario eliminado', { userId: req.params.uid });
      res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsersController();
