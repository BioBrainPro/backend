const express = require('express');
const User = require('../models/user');
const { authenticate, isSuperAdmin } = require('../middleware/authenticate');
const router = express.Router();

// Route for super admin to add a new user
router.post('/addUser', authenticate, isSuperAdmin, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, password, role: 'whitelistedUser' });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error adding user', error: err });
  }
});

// Route for super admin to delete a user
router.delete('/deleteUser/:userId', authenticate, isSuperAdmin, async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by the given userId
        // const user = await User.findById(userId);
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});

// Route for getting a list of all users (for super admin)
router.get('/users', authenticate, isSuperAdmin, async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find();
  
      // If no users are found, return a message
      if (!users.length) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      // Respond with the list of users
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err });
    }
});
  

module.exports = router;
