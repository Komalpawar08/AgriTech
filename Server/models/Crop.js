import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    maxlength: 100,
  },
  type: {
    type: String,
    enum: ['Vegetable', 'Fruit', 'Grain', 'Legume', 'Herb', 'Other'],
    default: 'Other',
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plantedDate: { type: Date },
  stage: {
    type: String,
    enum: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    default: 'Seedling',
  },
  notes: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

export default mongoose.model('Crop', cropSchema);
