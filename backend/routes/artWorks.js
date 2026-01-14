import express from 'express';
import { getArtWorks, getartWorkById, addArtWork, updateArtWork, deleteArtWork } from '../controllers/artworksController.js';

const router = express.Router();

//Get All
router.get('/', getArtWorks);

//Get Single
router.get('/:id', getartWorkById);

//Create
router.post('/', addArtWork);

//Update
router.put('/:id', updateArtWork);

//Delete
router.delete('/:id', deleteArtWork);

export default router;