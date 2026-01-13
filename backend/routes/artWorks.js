import express from 'express';
import { getArtWorks, getartWorkById } from '../controllers/artworksController.js';

const router = express.Router();

//Get All
router.get('/', getArtWorks);
router.get('/:id', getartWorkById);

export default router;