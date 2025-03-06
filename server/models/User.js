const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rank: { type: String, default: 'bronze', enum: ['bronze', 'silver', 'gold', 'platinum'] },
  petType: { type: String, default: 'dog' },
  colorScheme: { type: String, default: 'light' },
  notifications: { type: Boolean, default: true },
  backgroundTheme: { type: String, default: 'teal', enum: ['teal', 'purple', 'blue'] }, // New
  fontStyle: { type: String, default: 'Montserrat', enum: ['Montserrat', 'Roboto', 'OpenSans'] }, // New
  petAnimation: { type: Boolean, default: true } // New
});

module.exports = mongoose.model('User', UserSchema);