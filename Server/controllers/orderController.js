import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { product: productId, quantity, note } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: 'Product and quantity are required.' });
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1.' });

    // Server-side price calculation
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (product.stock < quantity) return res.status(400).json({ message: `Only ${product.stock} units available.` });

    const totalAmount = product.price * quantity;

    // Decrement stock
    product.stock -= quantity;
    await product.save();

    const order = await Order.create({
      user: req.user._id,
      product: productId,
      quantity,
      totalAmount,
      note,
    });

    await order.populate('product', 'name price');
    res.status(201).json(order);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Failed to place order.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('product', 'name price imageUrl').sort('-createdAt');
    res.json(orders);
  } catch { res.status(500).json({ message: 'Failed to fetch orders.' }); }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('product', 'name price')
      .sort('-createdAt');
    res.json(orders);
  } catch { res.status(500).json({ message: 'Failed to fetch orders.' }); }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('product', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch { res.status(500).json({ message: 'Failed to update order.' }); }
};
