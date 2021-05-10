import express from 'express';
import OrderItem from '../models/orderItemModel.js';
import Order from '../models/orderModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    orderItems,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    user,
  } = req.body;

  try {
    const orderItemsIds = Promise.all(
      orderItems.map(async ({ quantity, product }) => {
        let newOrderItem = new OrderItem({
          quantity,
          product,
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );

    const orderItemsIdsResolved = await orderItemsIds;
    const orderTotalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          'product',
          'price'
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = orderTotalPrices.reduce((acc, price) => acc + price, 0);

    const order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
      user,
    });
    const newOrder = await order.save();

    if (!newOrder) {
      res.status(400).json({
        status: 'fail',
        message: 'Order request failed.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order: newOrder },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name')
      .populate('orderItems')
      .sort('-orderDate');

    if (!orders) {
      res.status(400).json({
        status: 'fail',
        message: 'No orders in database.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

router.get('/total-sales', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);

    console.log('totalSales', totalSales);

    if (!totalSales) {
      res.status(400).json({
        status: 'fail',
        message: 'The order sales cannot be generated.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { totalSales: totalSales.pop().totalSales },
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
    const count = await Order.countDocuments((count) => count);

    if (!count) {
      return res.status(400).json({
        status: 'fail',
        message: 'Orders not found.',
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

router.get('/user/:id', async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.params.id })
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category',
        },
      })
      .sort('-orderDate');

    if (!userOrders) {
      res.status(400).json({
        status: 'fail',
        message: 'No userOrders in database.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { userOrders },
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
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      });

    if (!order) {
      res.status(400).json({
        status: 'fail',
        message: 'No order in database.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order },
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
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      res.status(400).json({
        status: 'fail',
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order },
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
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(400).json({
        status: 'fail',
        message: 'Order not found.',
      });
    }

    order.orderItems.forEach(async ({ _id }) => {
      await OrderItem.findByIdAndRemove(_id);
    });

    await order.deleteOne();

    res.status(200).json({
      status: 'success',
      data: { message: 'Order Deleted.' },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

export default router;
