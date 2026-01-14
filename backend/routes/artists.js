import express from 'express';
import { getArtists, getArtistById, createArtist, updateArtist, deleteArtist } from '../controllers/artistsController.js';

const router = express.Router();

//Get All
router.get('/', getArtists);

//Get Single
router.get('/:id', getArtistById);

//Create
router.post('/', createArtist);

//Update
router.put('/:id', updateArtist);

//Delete
router.delete('/:id', deleteArtist)

export default router;
