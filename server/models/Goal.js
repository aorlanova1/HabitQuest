const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  completed: { type: Boolean, default: false },
  streak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);