import express from 'express';
import { Message } from '../models/Message.js';
import { Lobby } from '../models/Lobby.js';

const router = express.Router();

// Get messages for a lobby
router.get('/messages/:lobbyId', async (req, res) => {
  try {
    const { lobbyId } = req.params;
    const { user } = req;

    // Check if user is a member of the lobby
    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    const isMember = lobby.members.some(member => member.uid === user.uid);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({ lobbyId })
      .sort({ timestamp: 1 })
      .limit(100);

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send message
router.post('/messages/:lobbyId', async (req, res) => {
  try {
    const { lobbyId } = req.params;
    const { content } = req.body;
    const { user } = req;

    // Check if user is a member of the lobby
    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    const isMember = lobby.members.some(member => member.uid === user.uid);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = new Message({
      lobbyId,
      sender: {
        uid: user.uid,
        name: user.name,
        photoURL: user.photoURL
      },
      content
    });

    await message.save();
    res.json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;