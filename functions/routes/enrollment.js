const express = require('express');
const bcrypt = require('bcryptjs');
const Driver = require('../schema/enrollment');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (err) {
        console.error('Error fetching drivers:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Signup route
router.post('/signup-driver', async (req, res) => {
    try {
      const { email, username, password, fullname, municipality, barangay, street, number, birthday } = req.body;
  
      // Add validation and save logic here
      const newDriver = new Driver({ email, username, password, fullname, municipality, barangay, street, number, birthday });
      await newDriver.save();
  
      res.status(200).json({ message: 'Signup successful', username });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server Error', error: error.message }); // Include the error message
    }
  });

// Login route
router.post('/login-driver', async (req, res) => {
    try {
        const { email, password } = req.body;

        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/enroll-vehicle', async (req, res) => {
    try {
        const { userId, type, model, year, plateNumber } = req.body;

        const driver = await Driver.findById(userId);
        if (!driver) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the plate number is already associated with another user
        const existingVehicle = driver.vehicles.find(vehicle => vehicle.plateNumber === plateNumber);
        if (existingVehicle) {
            return res.status(400).json({ message: 'Plate number already registered' });
        }

        // Add the vehicle to the user's vehicles array
        driver.vehicles.push({ type, model, year, plateNumber });
        await driver.save();

        res.status(201).json({ message: 'Vehicle enrolled successfully', vehicle: { type, model, year, plateNumber } });
    } catch (error) {
        console.error('Error enrolling vehicle:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
