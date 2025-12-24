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
const http = require('http');  // For HTTP server
const https = require('https'); // For HTTPS (optional, if you enable it)
const fs = require('fs'); // For SSL certificates (only for HTTPS)

dotenv.config();

const app = express();

// Use the PORT from the environment or default to 3000
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://biobrainpro.net', 
  'https://biobrainpro.info', 
  'http://localhost:5173',
  'http://localhost:5174'
];

// Middleware for CORS and authentication
app.use(
  cors({
    origin: (origin, callback) => {
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
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/home', require('./routes/home')); // Home content routes
app.use("/api/pages", isAuthenticated, require("./routes/page"));
app.use("/api/contact", require('./routes/contact'));
app.use("/api/app-config", require('./routes/app'));
app.use("/api/footer", require('./routes/footer'));
app.use("/api/header", require('./routes/header'));
app.use("/api/admin", require('./routes/admin'));

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload routes
app.use('/api/uploads', require('./routes/uploads')); // File upload handling

// HTTP server (to handle HTTP requests)
http.createServer(app).listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});

// Optional: HTTPS server (if you want HTTPS enabled with SSL certificates)
if (process.env.HTTPS_ENABLED === 'true') {
  const options = {
    key: fs.readFileSync('path/to/your/private-key.pem'),
    cert: fs.readFileSync('path/to/your/certificate.pem'),
    ca: fs.readFileSync('path/to/your/ca-certificate.pem')
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on https://localhost:${PORT}`);
  });
} else {
  console.log("HTTPS is not enabled. Running only with HTTP.");
}

// Function to check and create the super admin if not present
async function checkAndCreateSuperAdmin() {
  try {
    const superAdmin = await User.findOne({ email: 'BioBrainPro@gmail.com' });

    if (!superAdmin) {
      const newSuperAdmin = new User({
        email: 'BioBrainPro@gmail.com',
        password: 'BioBrainProAdmin2024',
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
