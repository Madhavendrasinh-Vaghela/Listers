// backend/utils/mailer.js

const nodemailer = require('nodemailer');
const Item = require('../models/item.model');
const User = require('../models/user.model');
const EmailLog = require('../models/emailLog.model');

// Create one transporter object to be reused
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

// Function 1: Sends the full daily digest
const sendDigestEmail = async () => {
  try {
    const usersWithItems = await Item.distinct("user");
    if (usersWithItems.length === 0) {
      console.log('No items to send in digest.');
      return;
    }

    for (const userId of usersWithItems) {
      const user = await User.findById(userId);
      if (!user) continue;

      const items = await Item.find({ user: userId });
      if (items.length === 0) continue;

      let itemListHtml = '<h1>Your Daily To-Do List</h1><ul>';
      items.forEach(item => {
        itemListHtml += `<li>${item.text}</li>`;
      });
      itemListHtml += '</ul>';
      
      const mailOptions = {
        from: `To-Do List App <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: 'Your Daily To-Do List Reminder',
        html: itemListHtml,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Digest email sent successfully to ${user.email}!`);
        // Create a success log
        await new EmailLog({ to: user.email, subject: 'Your Daily To-Do List Reminder', status: 'success' }).save();
      } catch (error) {
        console.error(`Error sending digest to ${user.email}:`, error);
        // Create a failure log
        await new EmailLog({ to: user.email, subject: 'Your Daily To-Do List Reminder', status: 'failure', error: error.message }).save();
      }
    }
  } catch (error) {
    console.error('Error in sendDigestEmail function:', error);
  }
};

// Function 2: Sends an instant notification for a new item
const sendNewItemEmail = async (userEmail, itemText) => {
    const mailOptions = {
        from: `To-Do List App <${process.env.SENDER_EMAIL}>`,
        to: userEmail,
        subject: 'New Item Added to Your List!',
        html: `<p>A new item has been added to your to-do list:</p><h2>${itemText}</h2>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`New item notification sent successfully to ${userEmail}!`);
        // Create a success log
        await new EmailLog({ to: userEmail, subject: 'New Item Added to Your List!', status: 'success' }).save();
    } catch (error) {
        console.error(`Error sending new item email to ${userEmail}:`, error);
        // Create a failure log
        await new EmailLog({ to: userEmail, subject: 'New Item Added to Your List!', status: 'failure', error: error.message }).save();
    }
};

module.exports = { sendDigestEmail, sendNewItemEmail };