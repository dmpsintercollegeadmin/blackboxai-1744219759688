const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect, restrictTo } = require('./authRoutes');

// Mark student attendance
router.post('/students', protect, restrictTo('teacher', 'admin'), async (req, res) => {
  try {
    const { date, studentId, classId, status, notes } = req.body;
    
    const attendance = await Attendance.create({
      date: date || Date.now(),
      student: studentId,
      class: classId,
      status,
      notes,
      markedBy: 'teacher'
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: 'Error recording attendance' });
  }
});

// Teacher self-attendance
router.post('/teachers', protect, restrictTo('teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.create({
      date: Date.now(),
      teacher: req.user.account,
      status: 'present',
      markedBy: 'self'
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: 'Error recording attendance' });
  }
});

// Get attendance reports
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'teacher') {
      query = { teacher: req.user.account };
    } else if (req.user.role === 'student') {
      query = { student: req.user.account };
    }

    const attendance = await Attendance.find(query)
      .populate('student teacher class')
      .sort('-date');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

module.exports = router;
