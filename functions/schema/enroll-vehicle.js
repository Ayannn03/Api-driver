const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type of vehicle is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model of vehicle is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year of manufacture is required'],
    min: [1886, 'Year must be greater than 1886'],
    max: [new Date().getFullYear(), `Year must be less than or equal to ${new Date().getFullYear()}`],
  },
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
