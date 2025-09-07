// routes/items.js (Final Version)

const router = require('express').Router();
let Item = require('../models/item.model');
let User = require('../models/user.model');
const auth = require('../middleware/auth'); // Import the auth middleware
const { sendNewItemEmail } = require('../utils/mailer');

// ROUTE 1: Get all list items FOR THE LOGGED-IN USER
// We add 'auth' as a second argument to protect this route
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 2: Add a new list item FOR THE LOGGED-IN USER
router.post('/add', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const newItem = new Item({
      text,
      user: req.user
    });
    const savedItem = await newItem.save();
    
    // After saving, find the user's email and send the notification
    const user = await User.findById(req.user);
    if (user) {
      sendNewItemEmail(user.email, savedItem.text);
    }

    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ROUTE 3: Delete a list item FOR THE LOGGED-IN USER
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!item) return res.status(404).json({ msg: 'Item not found or user not authorized' });
    res.json({ msg: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ROUTE 4: Update an existing list item FOR THE LOGGED-IN USER
router.put('/update/:id', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { text },
      { new: true }
    );
    if (!item) return res.status(404).json({ msg: 'Item not found or user not authorized' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;