// backend/routes/incidentRoutes.js

const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/incidents - Report a new incident
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category, description, address, coordinates } = req.body;
    
    // Updated to match the new model structure
    const incident = new Incident({
      category,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: coordinates
      },
      reportedBy: req.user.id
    });
    
    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
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
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;