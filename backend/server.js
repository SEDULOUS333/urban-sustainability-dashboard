require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://urban-sustainability-dashboard.netlify.app', // your Netlify URL
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community');

app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);

app.use('/api/air-quality', require('./routes/airQuality'));
app.use('/api/traffic', require('./routes/traffic'));
app.use('/api/energy', require('./routes/energy'));
app.use('/api/water', require('./routes/water'));
app.use('/api/waste', require('./routes/waste'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 