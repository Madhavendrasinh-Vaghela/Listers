// server.js (Final Version)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Item = require('./models/item.model'); // Import the Item model

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
app.use('/items', itemsRouter);
app.use('/api/users', usersRouter);

// Get variables from .env file
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

// --- Nodemailer and Cron Job Logic ---

// Function to send the email
const sendEmail = async () => {
  try {
    const items = await Item.find({});
    if (items.length === 0) {
      console.log('No items in the list. Email not sent.');
      return;
    }

    let itemListHtml = '<h1>Your To-Do List</h1><ul>';
    items.forEach(item => {
      itemListHtml += `<li>${item.text}</li>`;
    });
    itemListHtml += '</ul>';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    });

    const mailOptions = {
      from: SENDER_EMAIL,
      to: SENDER_EMAIL, // Sending to yourself
      subject: 'Your Daily To-Do List Reminder',
      html: itemListHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log('Daily digest email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Schedule the task to run at 8:00 AM every day
// Cron syntax: 'minute hour day-of-month month day-of-week'
cron.schedule('0 8 * * *', () => {
  console.log('Running scheduled job: Sending daily email...');
  sendEmail();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Set your timezone
});


// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);

      // --- TEMPORARY TEST: Send email on server start ---
      // Uncomment the line below to test the email function immediately
       sendEmail(); 
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });