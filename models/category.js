import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: String,
  color: String,
  icon: String,
  image: String,
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
