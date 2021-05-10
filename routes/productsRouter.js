import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const router = express.Router();

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type.');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${file.originalname}-${Date.now()}.${extension}`);
  },
});

var upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  const { categories } = req.query;

  try {
    if (!categories) {
      const products = await Product.find();

      return res.status(200).json({
        status: 'success',
        size: products.length,
        data: { products },
      });
    }

    const query = { category: categories.split(',') };
    const products = await Product.find(query);

    return res.status(200).json({
      status: 'success',
      size: products.length,
      data: { products },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({
      status: 'fail',
      message: 'Image is required. ',
    });
  }

  const { filename } = req.file;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;

  const {
    name,
    description,
    richDescription,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  try {
    const categoryId = await Category.findById(category);
    if (!categoryId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid category.',
      });
    }

    const product = new Product({
      name,
      description,
      richDescription,
      image: `${basePath}/${filename}`,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReviews,
      isFeatured,
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

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(400).json({
        status: 'fail',
        message: 'No products found.',
      });
    }

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

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { message: 'Product is deleted.' },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.get('/get/count', async (req, res) => {
  try {
    const count = await Product.countDocuments((count) => count);

    if (!count) {
      return res.status(400).json({
        status: 'fail',
        message: 'Products not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { count },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.get('/get/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });

    if (!products) {
      return res.status(400).json({
        status: 'fail',
        message: 'No featured products yet not.',
      });
    }

    res.status(200).json({
      status: 'success',
      size: products.length,
      data: { products },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.patch('/gallery/:id', upload.array('images', 103), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid product id.',
      });
    }

    if (req.files.length === 0) {
      res.status(400).json({
        status: 'fail',
        message: 'No images selected.',
      });
    }

    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
    let imagesPaths = req.files.map((image) => {
      return `${basePath}/${image.filename.split(' ').join('')}`;
    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product not found.',
      });
    }

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

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid product id.',
      });
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid Category.',
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid Id.',
      });
    }

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

export default router;
