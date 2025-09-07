// models/user.model.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // No two users can share the same email
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // Important: new users are not admins by default
  }

}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;