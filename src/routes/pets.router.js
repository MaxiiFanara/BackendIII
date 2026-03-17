import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import { validateMongoId, validatePetCreate } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', petsController.getAllPets);
router.get('/:pid', validateMongoId, petsController.getPetById);
router.post('/', validatePetCreate, petsController.createPet);
router.put('/:pid', validateMongoId, petsController.updatePet);
router.delete('/:pid', validateMongoId, petsController.deletePet);

export default router;
