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

        const address = {
            municipality,
            barangay,
            street,
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDriver = new Driver({
            email,
            username,
            password: hashedPassword,
            fullname,
            address,
            number,
            birthday,
        });

        await newDriver.save();

        res.status(200).json({ message: 'Signup successful', username });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
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
        const { type, model, year, plateNumber } = req.body;

        console.log('Enrollment data received:', req.body);

        // Check if the plate number is already registered
        const existingVehicle = await Vehicle.findOne({ plateNumber });
        if (existingVehicle) {
            return res.status(400).json({ message: 'Plate number already registered' });
        }

        // Create a new vehicle document
        const newVehicle = new Vehicle({
            type,
            model,
            year,
            plateNumber
        });

        // Save the new vehicle to the database
        await newVehicle.save();

        // Respond with success message
        res.status(201).json({ message: 'Vehicle enrolled successfully', vehicle: newVehicle });
    } catch (error) {
        console.error('Error enrolling vehicle:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
