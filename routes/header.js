const express = require('express');
const headerModel = require('../models/header'); // Import the footer config model
const router = express.Router();

// GET route to fetch the footer configuration
router.get('/', async (req, res) => {
  try {
    const headerSchema = await headerModel.findOne(); // Fetch the first document (if only one exists)
    if (!headerSchema) {
      return res.status(200).json({color: '', background: ''});
    }
    res.status(200).json(headerSchema);
  } catch (error) {
    console.error('Error fetching header configuration:', error);
    res.status(500).json({ message: 'Failed to fetch header configuration' });
  }
});

// POST route to create or update the footer configuration
router.post('/', async (req, res) => {
  try {
    const { background, color } = req.body;

    // Upsert: Create if not exists, otherwise update
    const updatedConfig = await headerModel.findOneAndUpdate(
      {}, // Match condition (empty object to match the first document)
      { background, color }, // New data
      { new: true, upsert: true } // Create if not exists
    );

    res.status(200).json({
      message: 'header configuration updated successfully',
      data: updatedConfig,
    });
  } catch (error) {
    console.error('Error updating header configuration:', error);
    res.status(500).json({ message: 'Failed to update header configuration' });
  }
});

module.exports = router;
