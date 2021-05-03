import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';

import productRotuer from './routes/productsRouter.js';
import categoryRotuer from './routes/categoryRouter.js';
import userRotuer from './routes/usersRouter.js';
import orderRotuer from './routes/ordersRouter.js';

const app = express();

const Product = mongoose.model('product', productSchema);

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
appapp.use(cors());
app.options('*', cors);

// routes
app.use('/api/v1/products', productRotuer);
app.use('/api/v1/categories', categoryRotuer);
app.use('/api/v1/users', userRotuer);
app.use('/api/v1/orders', orderRotuer);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
