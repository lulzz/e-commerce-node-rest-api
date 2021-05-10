import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';

import productRotuer from './routes/productsRouter.js';
import categoryRotuer from './routes/categoryRouter.js';
import userRotuer from './routes/userRouter.js';
import orderRotuer from './routes/orderRouter.js';
import { auth } from './middleware/auth.js';
import { errorHandler } from './helpers/errorHandler.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// global
dotenv.config();

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors);
app.use(auth());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

// routes
app.use('/api/v1/products', productRotuer);
app.use('/api/v1/categories', categoryRotuer);
app.use('/api/v1/users', userRotuer);
app.use('/api/v1/orders', orderRotuer);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
