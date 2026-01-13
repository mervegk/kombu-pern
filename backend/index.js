//Imports
import express from 'express';
import cors from 'cors';
import artists from './routes/artists.js'
import artWorks from './routes/artWorks.js'

const app = express();

//middleware
app.use(cors());
app.use(express.json())

/* ROUTES */
app.use('/artists', artists);
app.use('/art-works', artWorks);


app.listen(5000, () => {
  console.log('Server running on port 5000');
})
