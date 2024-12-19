const mongoose = require('mongoose');

const appConfig = new mongoose.Schema({
  logo: { type: String, required: true },
  title: { type: String, default: '' },
  langs: {     
    type: [String],  // Array of strings to store languages
    default: [],     // Default is an empty array
    required: true,  // Required field
  },
  conntactUsButton: {     
    en: { type: String, default: '' },
    ru: { type: String, default: '' },
    am: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  easyState: { type: Boolean, default: '' },
  brandColor: { type: String, default: '' },
  background: { type: String, required: true },
});

module.exports = mongoose.model('Content', appConfig);
