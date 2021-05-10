import express from 'express';
import User from './../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// get user
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');

    if (!users) {
      return res.status(400).json({
        status: 'fail',
        message: 'No users found.',
      });
    }

    res.status(200).json({
      status: 'success',
      size: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments((count) => count);

    if (!count) {
      return res.status(400).json({
        status: 'fail',
        message: 'Users not found.',
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

// get user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'No user found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      res.status(400).json({
        status: 'fail',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

// login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User not found.',
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid password.',
      });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      status: 'success',
      data: { email, token },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.post('/register', async (req, res) => {
  const {
    name,
    email,
    color,
    password,
    phone,
    isAdmin,
    apartment,
    zip,
    city,
    country,
  } = req.body;

  try {
    const user = await new User({
      name,
      email,
      color,
      password: bcrypt.hashSync(password, 10),
      phone,
      isAdmin,
      apartment,
      zip,
      city,
      country,
    });

    await user.save();

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid request.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
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
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { message: 'User is deleted.' },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

export default router;
