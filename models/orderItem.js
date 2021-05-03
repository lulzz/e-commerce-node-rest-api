import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: Product,
  quantity: Number,
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;
