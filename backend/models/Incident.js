// backend/models/Incident.js

const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Fire', 'Flood', 'Power Outage', 'Accident', 'Medical Emergency', 'Other']
  },
  description: { type: String, required: true },
  address: { type: String, required: true }, // Moved address to be a top-level field
  location: { // This field is now a pure GeoJSON object
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// The index now correctly points to the GeoJSON 'location' field
IncidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', IncidentSchema);