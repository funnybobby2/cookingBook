const mongoose = require('mongoose');

// //////////////////////////////  SCHEMAS   ////////////////////////////////

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  login: {
    type: String,
    match: /^[a-zA-Z0-9-_]+$/
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  email: {
    type: String,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/
  }
});

// //////////////////////////////  MODELS   ////////////////////////////////

module.exports = mongoose.model('User', userSchema);
