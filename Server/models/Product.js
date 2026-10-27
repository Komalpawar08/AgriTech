import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 150,
  },
  description: { type: String, trim: true, maxlength: 1000 },
  category: {
    type: String,
    enum: ['Seeds', 'Fertilizer', 'Tools', 'Pesticide', 'Equipment', 'Other'],
    default: 'Other',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  imageUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
