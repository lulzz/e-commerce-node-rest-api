import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: [true, 'Quantity is required.'],
  },
  product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;
