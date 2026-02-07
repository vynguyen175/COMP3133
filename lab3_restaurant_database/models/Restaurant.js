const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  restaurant_id: String,
  name: String,
  city: String,
  cuisine: String,
  address: {
    building: String,
    street: String,
    zipcode: String
  }
});

module.exports = mongoose.model('Restaurants', restaurantSchema);
