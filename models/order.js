import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderItems: [orderItem],
  shippingAddress1: String,
  shippingAddress2: String,
  city: String,
  zip: String,
  country: String,
  phone: Number,
  status: String,
  totalPrice: Number,
  user: User,
  ordered: Date,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
