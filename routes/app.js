const express = require('express');
const router = express.Router();
const Content = require('../models/app');

// Get the single configuration
router.get('/', async (req, res) => {
    try {
        const config = await Content.findOne(); // Fetch the first (and only) configuration
        res.status(200).json(config);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch configuration" });
    }
});

// Create or update the single configuration
router.post('/', async (req, res) => {
    const { logo, title, brandColor, langs, background, conntactUsButton, easyState } = req.body;

    try {
        let config = await Content.findOne(); // Check if a configuration already exists

        if (config) {
            // Update existing configuration
            config.logo = logo;
            config.title = title;
            config.brandColor = brandColor;
            config.background = background;
            config.conntactUsButton = conntactUsButton;
            config.langs = langs;
            config.easyState = easyState;
            await config.save();
        } else {
            // Create new configuration
            config = new Content({ logo, title, brandColor, background });
            await config.save();
        }

        res.status(200).json(config);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to save configuration" });
    }
});

module.exports = router;
