const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Create a new teacher
router.post('/', async (req, res) => {
  try {
    // Convert subjects string to array
    if (req.body.subjects && typeof req.body.subjects === 'string') {
      req.body.subjects = req.body.subjects.split(',').map(s => s.trim());
    }

    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).send(teacher);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.send(teachers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get teacher by ID
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).send();
    }
    res.send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update teacher
router.patch('/:id', async (req, res) => {
  try {
    // Convert subjects string to array if provided
    if (req.body.subjects && typeof req.body.subjects === 'string') {
      req.body.subjects = req.body.subjects.split(',').map(s => s.trim());
    }

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!teacher) {
      return res.status(404).send();
    }
    res.send(teacher);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).send();
    }
    res.send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
