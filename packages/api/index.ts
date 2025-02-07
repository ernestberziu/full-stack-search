import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import router from 'src/routes';
import './config';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.use('', router);

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
