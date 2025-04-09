const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Create a new class
router.post('/', async (req, res) => {
  try {
    // Convert days string to array if provided
    if (req.body.days && typeof req.body.days === 'string') {
      req.body.days = req.body.days.split(',').map(d => d.trim());
    }

    // Format schedule object
    if (req.body.days || req.body.time) {
      req.body.schedule = {
        days: req.body.days || [],
        time: req.body.time || ''
      };
      delete req.body.days;
      delete req.body.time;
    }

    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).send(newClass);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher');
    res.send(classes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get class by ID
router.get('/:id', async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('teacher');
    if (!classData) {
      return res.status(404).send();
    }
    res.send(classData);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update class
router.patch('/:id', async (req, res) => {
  try {
    // Convert days string to array if provided
    if (req.body.days && typeof req.body.days === 'string') {
      req.body.days = req.body.days.split(',').map(d => d.trim());
    }

    // Format schedule object if days or time provided
    if (req.body.days || req.body.time) {
      req.body.schedule = {
        days: req.body.days || [],
        time: req.body.time || ''
      };
      delete req.body.days;
      delete req.body.time;
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedClass) {
      return res.status(404).send();
    }
    res.send(updatedClass);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).send();
    }
    res.send(deletedClass);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
