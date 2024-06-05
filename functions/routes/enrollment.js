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

app.post('/enroll-vehicle', async (req, res) => {
    const { type, model, year, plateNumber } = req.body;
    try {
      const newVehicle = new Vehicle({ type, model, year, plateNumber });
      await newVehicle.save();
      res.status(201).json({ message: 'Vehicle enrolled successfully' });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Vehicle with this plate number already exists' });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  });

module.exports = router;
