const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const uploadFolder = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "image/svg+xml", // Allow SVG files
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

// Route to upload a file (image/video)
router.post('/upload', upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed.' });
  }
  res.status(200).json({
    message: 'File uploaded successfully.',
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Route to list all media files
router.get('/media', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read uploads folder.' });
    }
    const mediaFiles = files.map((file) => ({
      name: file,
      url: `/uploads/${file}`,
    }));
    res.status(200).json(mediaFiles);
  });
});

// Route to delete a file by its name
router.delete("/delete", async (req, res) => {
  const { filename } = req.body; // Get filename from request body

  if (!filename) {
    return res.status(400).json({ message: "No filename provided." });
  }

  const filePath = path.join(uploadFolder, filename); // Get the full path of the file

  try {
    // Check if file exists
    await fs.promises.access(filePath, fs.constants.F_OK);

    // Delete the file
    await fs.promises.unlink(filePath);
    res.status(200).json({ message: "File deleted successfully." });
  } catch (err) {
    if (err.code === "ENOENT") {
      // File not found
      return res.status(404).json({ message: "File not found." });
    }
    console.error("Error deleting file:", err);
    res.status(500).json({ message: "Error deleting file." });
  }
});

module.exports = router;
