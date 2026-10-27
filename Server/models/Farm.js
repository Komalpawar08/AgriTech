import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: 150,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  size: { type: Number, min: 0 },
  description: { type: String, trim: true, maxlength: 500 },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Farm', farmSchema);
