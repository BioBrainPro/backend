const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const { isAuthenticated } = require('../middleware/auth'); // Middleware to protect routes
const homeContent = require('../mock');

// POST or update home content
router.post('/homeContent', isAuthenticated, async (req, res) => {
  try {
    // Validate if title and title.en exist in the request body
    if (!req.body || !req.body.title || !req.body.title.en) {
      return res.status(400).json({ message: 'title and title.en are required in the request body' });
    }

    // Use `findOneAndUpdate` for upserting (update if exists, insert if not)
    const updatedContent = await HomeContent.findOneAndUpdate(
      { 'title.en': req.body.title.en }, // Query: match by title.en
      req.body, // Update data
      { new: true, upsert: true } // Options: `new` returns the updated document, `upsert` creates if it doesn't exist
    );

    res.status(200).json({
      message: updatedContent.isNew ? 'Home content created successfully' : 'Home content updated successfully',
      content: updatedContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating or updating home content', error });
  }
});

// GET home content
router.get('/homeContent', async (req, res) => {
  try {
    // Fetch the home content (if you want to fetch a specific item, you can add query parameters to filter)
    const homeContentDb = await HomeContent.find(); // This fetches all home content

    if (homeContentDb?.length === 0) {
        return res.status(200).json({ content: homeContent });
    }

    res.status(200).json({ content: homeContentDb });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching home content', error });
  }
});

module.exports = router;
