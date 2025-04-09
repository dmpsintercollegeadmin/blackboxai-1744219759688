const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  subjects: [String],
  hireDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'on-leave', 'retired'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
