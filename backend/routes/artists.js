import express from 'express';
import { getArtists, getArtistById } from '../controllers/artistsController.js';

const router = express.Router();

//Get All
router.get('/', getArtists);

//Get Single
router.get('/:id', getArtistById);

export default router;
