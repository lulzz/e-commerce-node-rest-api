import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
  richDescription: {
    type: String,
    default: '',
  },
  image: {
    type: String,
  },
  images: [{ type: String }],
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required.'],
  },
  countInStock: {
    type: Number,
    required: [true, 'CountInStock is required.'],
    min: [0, 'Count in stock must be greater than 0.'],
    max: [255, 'Count in stock must be less than 255.'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

const product = mongoose.model('Product', productSchema);
export default product;
