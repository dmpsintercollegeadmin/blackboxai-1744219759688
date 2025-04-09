const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  markedBy: { type: String, enum: ['teacher', 'self'], required: true },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
