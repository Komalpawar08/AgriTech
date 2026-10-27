import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';

export const getCrops = async (req, res) => {
  try {
    const query = { owner: req.user._id };
    if (req.query.farm) query.farm = req.query.farm;
    const crops = await Crop.find(query).populate('farm', 'name location').sort('-createdAt');
    res.json(crops);
  } catch { res.status(500).json({ message: 'Failed to fetch crops.' }); }
};

export const createCrop = async (req, res) => {
  try {
    const { name, type, farm, plantedDate, stage, notes } = req.body;
    if (!name || !farm) return res.status(400).json({ message: 'Crop name and farm are required.' });

    // Verify farm belongs to user
    const farmDoc = await Farm.findOne({ _id: farm, owner: req.user._id });
    if (!farmDoc) return res.status(403).json({ message: 'Farm not found or access denied.' });

    const crop = await Crop.create({ name, type, farm, plantedDate: plantedDate || undefined, stage, notes, owner: req.user._id });
    await crop.populate('farm', 'name location');
    res.status(201).json(crop);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Failed to create crop.' });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!crop) return res.status(404).json({ message: 'Crop not found.' });
    await crop.deleteOne();
    res.json({ message: 'Crop deleted.' });
  } catch { res.status(500).json({ message: 'Failed to delete crop.' }); }
};
