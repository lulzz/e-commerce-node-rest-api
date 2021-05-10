import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'OrderItem',
      required: [true, 'Order Item is required.'],
    },
  ],
  shippingAddress1: {
    type: String,
    required: [true, 'Shipping addres is required.'],
  },
  shippingAddress2: {
    type: String,
    required: [true, 'Shipping addres is required.'],
  },
  zip: {
    type: String,
    required: [true, 'City is required.'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required.'],
  },
  status: {
    type: String,
    required: [true, 'Status is required.'],
    default: 'Pending',
  },
  totalPrice: {
    type: Number,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
