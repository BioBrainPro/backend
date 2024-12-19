const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const router = express.Router();

// Set up file storage in memory (file upload is optional)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route for contact form with optional file upload
router.post('/', upload.single('file'), async (req, res) => {
    const { name, email, subject, message } = req.body;
    const file = req.file; // The file uploaded (optional)

    // If the file is uploaded, include it as an attachment
    const attachments = file
        ? [{
            filename: file.originalname,   // Use the uploaded file's name
            content: file.buffer,          // The content of the file (buffer)
        }]
        : [];

    try {
        // Create a transporter using your email service (e.g., Gmail)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'bioBrainPro@gmail.com',  // Sender's email address
                pass: 'zvmq lsbs tjto vmil',   // Sender's email password
            },
        });

        // Setup email options
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: 'bioBrainPro@gmail.com', // Replace with recipient's email
            subject: subject,
             text: `Message from: ${name} <${email}>\n\n${message}`,
            attachments: attachments,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to send email" });
    }
});

module.exports = router;
