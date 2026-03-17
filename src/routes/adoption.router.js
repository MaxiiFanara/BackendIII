import { Router } from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import { validateMongoId } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', adoptionsController.getAllAdoptions);
router.get('/:aid', validateMongoId, adoptionsController.getAdoptionById);
router.post('/:uid/:pid', validateMongoId, adoptionsController.createAdoption);

export default router;
