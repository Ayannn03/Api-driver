const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth');
const bookingRouter = require('./routes/booking');
const driverRouter = require('./routes/enrollment');

const app = express();

// Your MongoDB Cloud URL
const dbCloudUrl = 'mongodb+srv://Mawi:Mawi21@cluster0.twni9tv.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
const dbLocalUrl = 'mongodb://localhost:27017/users';

// Define CORS options
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(dbCloudUrl || dbLocalUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

// Define routes
app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api/booking', bookingRouter);
app.use('/.netlify/functions/api/driver', driverRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports.handler = serverless(app);
