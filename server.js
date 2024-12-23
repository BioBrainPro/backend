const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const path = require('path');
const pageRoutes = require("./routes/page");
const contactRoutes = require('./routes/contact');
const { isAuthenticated } = require('./middleware/auth');  

// Super Admin credentials
const SUPER_ADMIN_EMAIL = 'BioBrainPro@gmail.com';
const SUPER_ADMIN_PASSWORD = 'BioBrainProAdmin2024';

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const uploadsRoutes = require('./routes/uploads');
const appRoutes = require('./routes/app');
const footerRoutes = require('./routes/footer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define the allowed origins
const allowedOrigins = [
  'https://biobrainpro.net', 
  'https://biobrainpro.info', 
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
  })
)

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await checkAndCreateSuperAdmin();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/home', homeRoutes); // Home content routes
app.use("/api/pages", isAuthenticated, pageRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/app-config", appRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/admin", adminRoutes);

// Middleware to serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Make uploads folder accessible

// Upload routes
app.use('/api/uploads', uploadsRoutes); // Upload file handling and media fetching routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Function to check and create the super admin if not present
async function checkAndCreateSuperAdmin() {
  try {
    const superAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (!superAdmin) {
      // If no super admin found, create a new one
      const newSuperAdmin = new User({
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        role: 'superAdmin',
      });

      await newSuperAdmin.save();
      console.log('Super admin created successfully!');
    } else {
      console.log('Super admin already exists.');
    }
  } catch (error) {
    console.error('Error checking or creating super admin:', error);
  }
}
