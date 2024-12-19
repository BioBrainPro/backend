const mongoose = require('mongoose');

// Define schema for media links
const mediaLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., 'Facebook', 'Twitter'
  link: { type: String, required: true },     // e.g., 'https://facebook.com/page'
  icon: { type: String, default: "" },        // Icon URL or path (optional)
}, { _id: false }); // Disable _id for media link sub-documents if not needed

// Define schema for content (title and content in multiple languages)
const contentSchema = new mongoose.Schema({
  en: { type: String, default: "" }, // English content
  am: { type: String, default: "" }, // Armenian content
  ru: { type: String, default: "" }, // Russian content
  link: { type: String, default: "" }, // Optional link
}, { _id: false }); // Disable _id for content sub-documents if not needed

// Define schema for sections
const sectionSchema = new mongoose.Schema({
  title: contentSchema,  // Title in multiple languages (no link here)
  content: [contentSchema], // Content array (each with multiple languages and optional link)
}, { _id: false }); // Disable _id for section sub-documents if not needed

// Main app configuration schema
const appConfigSchema = new mongoose.Schema({
  background: { type: String, required: true }, // Background color or image
  sections: { 
    type: [sectionSchema], 
    required: true,  // Array of sections
    default: [] 
  },
  mediaLinks: { 
    type: [mediaLinkSchema], 
    default: [] // Array of media links
  },
  contactUs: { 
    type: [mongoose.Schema.Types.Mixed], 
    default: [
      { address: "", phone: "", email: "" }
    ] 
  },
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('AppConfig', appConfigSchema);
