// models/emailLog.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailLogSchema = new Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['success', 'failure'] // Only allows these two values
  },
  error: { type: String } // To store any error message if it fails
}, {
  timestamps: true,
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);
module.exports = EmailLog;