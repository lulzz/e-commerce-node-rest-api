import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  street: String,
  apartment: String,
  city: String,
  zip: String,
  country: String,
  phone: Number,
  isAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);
export default User;
