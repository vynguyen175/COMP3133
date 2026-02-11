const express = require('express');
const GroupMessage = require('../models/GroupMessage');
const PrivateMessage = require('../models/PrivateMessage');

const router = express.Router();

// Get group messages for a room
router.get('/room/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;

    const messages = await GroupMessage.find({ room: roomName })
      .sort({ date_sent: 1 })
      .limit(50); // Limit to last 50 messages

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching room messages:', err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Get private messages for a user
router.get('/private/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const messages = await PrivateMessage.find({
      $or: [{ from_user: username }, { to_user: username }],
    })
      .sort({ date_sent: 1 })
      .limit(100); // Limit to last 100 messages

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching private messages:', err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

module.exports = router;
