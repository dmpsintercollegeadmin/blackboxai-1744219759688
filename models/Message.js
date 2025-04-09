const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['Teacher', 'Admin']
  },
  recipients: [{
    recipientType: {
      type: String,
      enum: ['student', 'parent', 'class'],
      required: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'recipients.recipientType'
    }
  }],
  subject: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }],
  isBroadcast: { type: Boolean, default: false },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
