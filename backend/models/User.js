const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  serviceLocations: { type: [locationSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
