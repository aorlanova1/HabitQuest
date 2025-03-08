const express = require('express');
const router = express.Router(); // Define router here
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (transporter) => {
console.log("Im hit!");
  router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
	console.log("Im hit!");
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'Email already exists' });

      user = await User.findOne({ username });
      if (user) return res.status(400).json({ msg: 'Username already exists' });

      user = new User({ email, username, password: await bcrypt.hash(password, 10) });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to HabitQuest!',
        text: `Hi ${username},\n\nWelcome to HabitQuest! Start tracking your habits today.\n\nBest,\nThe HabitQuest Team`
      });

      res.json({ token });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    console.log('Login attempt:', { identifier }); // Debug log
    try {
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
      });
      if (!user) {
        console.log('User not found:', identifier); // Debug log
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      console.log('Found user:', user.email); // Debug log
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for:', user.email); // Debug log
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful for:', user.email); // Debug log
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  router.get('/user', async (req, res) => {
    try {
      const token = req.header('x-auth-token');
      if (!token) return res.status(401).json({ msg: 'No token' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error('User fetch error:', err);
      res.status(401).json({ msg: 'Token invalid' });
    }
  });

  return router;
};
