const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('./authRoutes');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Get child's information
router.get('/my-child', protect, restrictTo('parent'), async (req, res) => {
  try {
    const parentId = req.user.account;
    const child = await Student.findOne({ parents: parentId })
      .populate('currentClass')
      .populate('parents');

    if (!child) {
      return res.status(404).json({ message: 'No child found' });
    }

    res.json(child);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get child's attendance
router.get('/attendance', protect, restrictTo('parent'), async (req, res) => {
  try {
    const parentId = req.user.account;
    const child = await Student.findOne({ parents: parentId });

    if (!child) {
      return res.status(404).json({ message: 'No child found' });
    }

    const attendance = await Attendance.find({ student: child._id })
      .populate('class')
      .sort('-date');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fee details
router.get('/fees', protect, restrictTo('parent'), async (req, res) => {
  try {
    const parentId = req.user.account;
    const child = await Student.findOne({ parents: parentId });

    if (!child) {
      return res.status(404).json({ message: 'No child found' });
    }

    res.json(child.fees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
