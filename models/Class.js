const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true
  },
  gradeLevel: {
    type: Number,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  schedule: {
    days: [String],
    time: String
  },
  roomNumber: String,
  capacity: Number,
  currentStudents: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
