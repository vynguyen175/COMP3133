const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// POST endpoint to insert user
app.post('/users', async (req, res) => {
  try {
    const { username, email, city, website, zipCode, phone } = req.body;

    // Create new user
    const user = new User({
      username,
      email,
      city,
      website,
      zipCode,
      phone
    });

    // Save user to database
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: user
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists',
        error: 'This email is already registered'
      });
    }

    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
});

// GET endpoint to retrieve all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: 'Users retrieved successfully',
      users: users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
