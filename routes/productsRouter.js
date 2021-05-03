import express from 'express';
import Product from './../models/product';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
    });

    await product.save();
    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.get('/', async (req, res) => {
  const products = await Product.find();

  res.send(products);
});

export default router;
