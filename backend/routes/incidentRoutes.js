// backend/routes/incidentRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Incident = require('../models/Incident');
const authMiddleware = require('../middleware/authMiddleware');

// --- CLOUDINARY CONFIGURATION ---
// This automatically uses the keys from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- MULTER CONFIGURATION ---
// We use memoryStorage to temporarily hold the file as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- CLOUDINARY UPLOAD HELPER FUNCTION ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Create an upload stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "crisisconnect_incidents" }, // Optional: This will organize uploads in a specific folder
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    // Pipe the file buffer into the upload stream
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// --- ROUTES ---

// POST /api/incidents - Report a new incident
// We add the 'upload.single('media')' middleware to handle the file
router.post('/', authMiddleware, upload.single('media'), async (req, res) => {
  try {
    const { category, description, address, coordinates } = req.body;
    let imageUrl = null;

    // 1. Check if a file was uploaded
    if (req.file) {
      // 2. If yes, upload it to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      // 3. Get the secure URL of the uploaded image
      imageUrl = uploadResult.secure_url;
    }

    // When using FormData, numbers and objects are sent as strings. We need to parse them.
    const parsedCoordinates = JSON.parse(coordinates);

    // 4. Create a new incident with all the data
    const incident = new Incident({
      category,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: parsedCoordinates
      },
      imageUrl: imageUrl, // Add the image URL here (will be null if no file was uploaded)
      reportedBy: req.user.id
    });

    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    console.error("Error reporting incident:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/incidents/nearby?lat=...&lng=... - Get nearby incidents
router.get('/nearby', authMiddleware, async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required.' });
        }

        const maxDistance = 10000; // 10 kilometers

        const incidents = await Incident.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: maxDistance
                }
            },
            status: { $ne: 'Resolved' }
        }).populate('reportedBy', 'fullname').sort({ createdAt: -1 });

        res.json(incidents);
    } catch (error) { // --- THIS IS THE CORRECTED BLOCK ---
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;