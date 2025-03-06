const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Goal = require('../models/Goal');
const User = require('../models/User');

module.exports = (transporter) => {
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

  router.get('/', auth, async (req, res) => {
    const goals = await Goal.find({ user: req.user });
    res.json(goals);
  });

  router.post('/', auth, async (req, res) => {
    const { name, description, type, priority } = req.body;
    const goal = new Goal({ user: req.user, name, description, type, priority });
    await goal.save();
    res.json(goal);
  });

  router.put('/:id', auth, async (req, res) => {
    const { completed } = req.body;
    try {
      const goal = await Goal.findOne({ _id: req.params.id, user: req.user });
      if (!goal) return res.status(404).json({ msg: 'Goal not found' });

      if (completed && !goal.completed) {
        goal.completed = true;
        goal.streak += 1;
        await goal.save();

        const user = await User.findById(req.user);
        const completedGoals = await Goal.countDocuments({ user: req.user, completed: true });
        if (completedGoals >= 20 && user.rank === 'gold') user.rank = 'platinum';
        else if (completedGoals >= 10 && user.rank === 'silver') user.rank = 'gold';
        else if (completedGoals >= 5 && user.rank === 'bronze') user.rank = 'silver';
        await user.save();

        if (user.notifications) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Goal Completed!',
            text: `Hi ${user.username},\n\nYou completed "${goal.name}"! Your streak is now ${goal.streak}. New rank: ${user.rank}.\n\nKeep it up!\nThe HabitQuest Team`
          });
        }
      }

      res.json(goal);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });

  return router;
};