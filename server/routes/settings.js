const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid' });
  }
};

router.put('/', auth, async (req, res) => {
  const { colorScheme, petType, notifications, backgroundTheme, fontStyle, petAnimation } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { colorScheme, petType, notifications, backgroundTheme, fontStyle, petAnimation },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;