const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  municipality: {
    type: String,
    required: true
  },
  barangay: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  }
});

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true
  }
});

const driverSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  address: {
    type: addressSchema,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  vehicles: [vehicleSchema] // Array of vehicleSchema to allow multiple vehicles
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
