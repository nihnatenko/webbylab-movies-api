const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.sessions = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: 0,
        error: { fields: { email: 'INVALID_CREDEMTIALS' }, code: 'AUTHENTICATION_FAILED' },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: 1, token });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};

exports.users = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ status: 0, error: 'USER_EXISTS' });

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ status: 1, token });
  } catch (error) {
    console.error('Auth Error Details:', error);
    res.status(500).json({ status: 0, error: error.message });
  }
};
