const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [4, 'Username must be at least 4 characters long'],
    maxlength: [100, 'Username cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    match: [/^[a-zA-Z\s]+$/, 'City must contain only alphabets and spaces']
  },
  website: {
    type: String,
    required: [true, 'Website is required'],
    match: [/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, 'Please provide a valid website URL (http or https)']
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required'],
    match: [/^\d{5}-\d{4}$/, 'Zip code format must be DDDDD-DDDD']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^1-\d{3}-\d{3}-\d{4}$/, 'Phone format must be 1-DDD-DDD-DDDD']
  }
});

module.exports = mongoose.model('User', userSchema);
