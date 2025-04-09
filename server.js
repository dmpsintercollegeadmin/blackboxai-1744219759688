require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const { router: authRoutes, protect, restrictTo } = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Database connection
const connectDB = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    
    await mongoose.connect('mongodb://127.0.0.1:27017/schoolmanagementdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('School Management System API');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', protect, studentRoutes);
app.use('/api/teachers', protect, require('./routes/teacherRoutes'));
app.use('/api/classes', protect, require('./routes/classRoutes'));
app.use('/api/attendance', protect, require('./routes/attendanceRoutes'));
app.use('/api/parents', protect, require('./routes/parentRoutes'));
app.use('/api/messages', protect, require('./routes/messageRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
