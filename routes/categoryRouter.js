import express from 'express';
import Category from '../models/categoryModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res.status(500).json({
        status: 'fail',
        message: 'Categories not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { categories },
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
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(500).json({
        status: 'fail',
        message: 'The category with the given ID was not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { category },
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
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { category },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.post('/', async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();

  if (!category) {
    return res.status(404).json({
      status: 'fail',
      message: 'Category cannot be created.',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { message: 'Category successfuly deleted.' },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Unexpected error occurred.',
    });
  }
});

export default router;
