const mongoose = require('mongoose');
const enrollmentSchema = require('../schema/enrollment');

const DriverModel = mongoose.model('Driver', enrollmentSchema);

module.exports = DriverModel;