const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superAdmin', 'whitelistedUser'], default: 'whitelistedUser' },
});

// Hash password before saving (only if password is modified)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (password) {
  try {
    // Compare the provided password with the stored hashed password
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
