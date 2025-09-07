// server.js (Final Version)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Item = require('./models/item.model'); // Import the Item model
const { sendDigestEmail } = require('./utils/mailer'); // Import the function
const User = require('./models/user.model');

// Initialize the Express app
const app = express();
app.use(cors({
    origin: "https://listers-three.vercel.app",
    optionsSuccessStatus: 200
}));
app.use(express.json());

// API Routes
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
app.use('/items', itemsRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);

// Get variables from .env file
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

// --- Nodemailer and Cron Job Logic ---

// Function to send the email


// Schedule the task to run at 8:00 AM every day
// Cron syntax: 'minute hour day-of-month month day-of-week'
cron.schedule('0 8 * * *', () => {
  console.log('Running scheduled job: Sending daily email digest...');
  sendDigestEmail(); // Use the imported function
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});


// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);

    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });