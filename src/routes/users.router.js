import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { validateMongoId, validateUserCreate } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', usersController.getAllUsers);
router.get('/:uid', validateMongoId, usersController.getUserById);
router.post('/', validateUserCreate, usersController.createUser);
router.put('/:uid', validateMongoId, usersController.updateUser);
router.delete('/:uid', validateMongoId, usersController.deleteUser);

export default router;
