const mongoose = require('mongoose');

// Main app configuration schema
const headerSchema = new mongoose.Schema({
  background: { type: String, default: '' }, // Background color or image
  color: { type: String, default: '' }, // Background color or image
  
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('headerSchema', headerSchema);
