import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Farm from '../models/Farm.js';

export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.find().populate('product', 'name price').sort('-createdAt').limit(5),
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      recentOrders,
    });
  } catch { res.status(500).json({ message: 'Dashboard fetch failed.' }); }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json(users);
  } catch { res.status(500).json({ message: 'Failed to fetch users.' }); }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role.' });
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: `User role updated to ${role}.`, user });
  } catch { res.status(500).json({ message: 'Failed to update user role.' }); }
};
