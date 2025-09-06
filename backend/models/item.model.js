// models/item.model.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
    user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;