const express = require('express');
const FooterConfig = require('../models/footer'); // Import the footer config model
const { footerMock } = require('../mock');
const router = express.Router();

// GET route to fetch the footer configuration
router.get('/', async (req, res) => {
  try {
    const footerConfig = await FooterConfig.findOne(); // Fetch the first document (if only one exists)
    if (!footerConfig) {
      return res.status(200).json(footerMock);
    }
    res.status(200).json(footerConfig);
  } catch (error) {
    console.error('Error fetching footer configuration:', error);
    res.status(500).json({ message: 'Failed to fetch footer configuration' });
  }
});

// POST route to create or update the footer configuration
router.post('/', async (req, res) => {
  try {
    const { sections, background, contactUs, mediaLinks } = req.body;

    // Optionally validate mediaLinks if provided
    if (mediaLinks && !Array.isArray(mediaLinks)) {
      return res.status(400).json({ message: 'MediaLinks field must be an array' });
    }

    // Upsert: Create if not exists, otherwise update
    const updatedConfig = await FooterConfig.findOneAndUpdate(
      {}, // Match condition (empty object to match the first document)
      { sections, mediaLinks, background, contactUs, }, // New data
      { new: true, upsert: true } // Create if not exists
    );

    res.status(200).json({
      message: 'Footer configuration updated successfully',
      data: updatedConfig,
    });
  } catch (error) {
    console.error('Error updating footer configuration:', error);
    res.status(500).json({ message: 'Failed to update footer configuration' });
  }
});

module.exports = router;
