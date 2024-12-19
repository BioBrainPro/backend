// models/content.js

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: { type: String, required: true }, // e.g., "homepage", "about"
  text: { type: String, required: true },    // Content text for the section
  mediaUrl: { type: String, default: '' },   // URL for images/videos
});

module.exports = mongoose.model('Content', contentSchema);
