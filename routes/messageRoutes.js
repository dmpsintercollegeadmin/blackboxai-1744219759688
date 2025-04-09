const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('./authRoutes');
const Message = require('../models/Message');
const multer = require('multer');
const path = require('path');

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/messages');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for PDFs and images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || 
      file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs and images are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Send message
router.post('/', 
  protect,
  upload.array('attachments', 3),
  async (req, res) => {
    try {
      const { recipients, subject, content, isBroadcast } = req.body;
      
      const attachments = req.files?.map(file => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype
      })) || [];

      const message = await Message.create({
        sender: req.user.account,
        senderModel: req.user.accountModel,
        recipients: JSON.parse(recipients),
        subject,
        content,
        attachments,
        isBroadcast: isBroadcast === 'true'
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: 'Error sending message' });
    }
  }
);

// Get messages
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { 'recipients.recipientId': req.user.account },
        { sender: req.user.account }
      ]
    })
    .populate('sender')
    .sort('-createdAt');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Mark as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: req.user._id } },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: 'Error updating message' });
  }
});

module.exports = router;
