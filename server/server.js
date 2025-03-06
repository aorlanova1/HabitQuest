require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const goalRoutes = require('./routes/goals');
const settingsRoutes = require('./routes/settings');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://74.208.11.61:3000'  
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.use('/api/auth', authRoutes(transporter));
app.use('/api/goals', goalRoutes(transporter));
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));