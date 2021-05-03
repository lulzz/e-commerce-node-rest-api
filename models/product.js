import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  richDescription: String,
  image: String,
  images: [String],
  brand: String,
  price: Number,
  category: Category,
  countInStock: Number,
  rating: Number,
  isFeatured: Boolean,
  created: Date,
});

const Product = mongoose.model('Product', productSchema);
export default Product;
