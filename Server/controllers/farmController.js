import Farm from '../models/Farm.js';

export const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user._id }).sort('-createdAt');
    res.json(farms);
  } catch { res.status(500).json({ message: 'Failed to fetch farms.' }); }
};

export const createFarm = async (req, res) => {
  try {
    const { name, location, size, description } = req.body;
    if (!name || !location) return res.status(400).json({ message: 'Name and location are required.' });
    const farm = await Farm.create({ name, location, size: size || undefined, description, owner: req.user._id });
    res.status(201).json(farm);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Failed to create farm.' });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, owner: req.user._id });
    if (!farm) return res.status(404).json({ message: 'Farm not found.' });
    await farm.deleteOne();
    res.json({ message: 'Farm deleted.' });
  } catch { res.status(500).json({ message: 'Failed to delete farm.' }); }
};
