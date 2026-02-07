const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET /restaurants/cuisine/:cuisine - Return restaurants by cuisine
router.get('/cuisine/:cuisine', async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const restaurants = await Restaurant.find({ cuisine: cuisine });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /restaurants/Delicatessen - Return Delicatessen restaurants not in Brooklyn
router.get('/Delicatessen', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      cuisine: 'Delicatessen',
      city: { $ne: 'Brooklyn' }
    })
      .select('cuisine name city -_id')
      .sort({ name: 1 });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /restaurants or /restaurants?sortBy=ASC/DESC - Return all restaurants, optionally sorted
router.get('/', async (req, res) => {
  try {
    const sortBy = req.query.sortBy;

    if (sortBy) {
      // If sortBy query parameter is provided, return sorted by restaurant_id
      const sortOrder = sortBy === 'DESC' ? -1 : 1;
      const restaurants = await Restaurant.find()
        .select('_id cuisine name city restaurant_id')
        .sort({ restaurant_id: sortOrder });
      res.json(restaurants);
    } else {
      // Otherwise return all restaurants without sorting
      const restaurants = await Restaurant.find();
      res.json(restaurants);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
