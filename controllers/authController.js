const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, error: 'User already exists' });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Provide email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    res.status(200).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
