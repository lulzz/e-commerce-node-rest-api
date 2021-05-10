import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  apartment: {
    type: String,
    required: [true, 'Apartment is required.'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },

  zip: {
    type: String,
    required: [true, 'Zip is required.'],
  },
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: '',
  },
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

const User = mongoose.model('User', userSchema);
export default User;
