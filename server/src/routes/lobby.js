import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Lobby } from '../models/Lobby.js';
import { Message } from '../models/Message.js';

const router = express.Router();

// Create new lobby
router.post('/lobby/create', async (req, res) => {
  try {
    const { name } = req.body;
    const { user } = req;

    const lobby = new Lobby({
      name,
      creator: user.uid,
      members: [{
        uid: user.uid,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: 'creator'
      }],
      inviteCode: uuidv4().substring(0, 8)
    });

    await lobby.save();
    res.json({ success: true, lobby });
  } catch (error) {
    console.error('Create lobby error:', error);
    res.status(500).json({ error: 'Failed to create lobby' });
  }
});

// Join lobby
router.post('/lobby/join', async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const { user } = req;

    const lobby = await Lobby.findOne({ inviteCode });
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    // Check if user is already a member
    const existingMember = lobby.members.find(member => member.uid === user.uid);
    if (existingMember) {
      return res.json({ success: true, message: 'Already a member' });
    }

    lobby.members.push({
      uid: user.uid,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: 'member'
    });

    await lobby.save();
    res.json({ success: true, lobby });
  } catch (error) {
    console.error('Join lobby error:', error);
    res.status(500).json({ error: 'Failed to join lobby' });
  }
});

// Leave lobby
router.post('/lobby/leave', async (req, res) => {
  try {
    const { lobbyId } = req.body;
    const { user } = req;

    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    // Don't allow creator to leave
    if (lobby.creator === user.uid) {
      return res.status(400).json({ error: 'Creator cannot leave lobby' });
    }

    lobby.members = lobby.members.filter(member => member.uid !== user.uid);
    await lobby.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Leave lobby error:', error);
    res.status(500).json({ error: 'Failed to leave lobby' });
  }
});

// Kick member
router.post('/lobby/kick', async (req, res) => {
  try {
    const { lobbyId, uid } = req.body;
    const { user } = req;

    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    const currentMember = lobby.members.find(member => member.uid === user.uid);
    if (!currentMember || (currentMember.role === 'member')) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const targetMember = lobby.members.find(member => member.uid === uid);
    if (!targetMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Creator can kick anyone, moderators can only kick members
    if (currentMember.role === 'moderator' && targetMember.role !== 'member') {
      return res.status(403).json({ error: 'Cannot kick creator or moderator' });
    }

    lobby.members = lobby.members.filter(member => member.uid !== uid);
    await lobby.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Kick member error:', error);
    res.status(500).json({ error: 'Failed to kick member' });
  }
});

// Assign moderator
router.post('/lobby/assign-moderator', async (req, res) => {
  try {
    const { lobbyId, uid } = req.body;
    const { user } = req;

    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    // Only creator can assign moderators
    if (lobby.creator !== user.uid) {
      return res.status(403).json({ error: 'Only creator can assign moderators' });
    }

    const member = lobby.members.find(member => member.uid === uid);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    member.role = 'moderator';
    await lobby.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Assign moderator error:', error);
    res.status(500).json({ error: 'Failed to assign moderator' });
  }
});

// Delete lobby
router.delete('/lobby/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const lobby = await Lobby.findById(id);
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    // Only creator can delete lobby
    if (lobby.creator !== user.uid) {
      return res.status(403).json({ error: 'Only creator can delete lobby' });
    }

    await Lobby.findByIdAndDelete(id);
    await Message.deleteMany({ lobbyId: id });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete lobby error:', error);
    res.status(500).json({ error: 'Failed to delete lobby' });
  }
});

// Get user's lobbies
router.get('/lobbies/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const lobbies = await Lobby.find({ 'members.uid': userId });
    res.json({ lobbies });
  } catch (error) {
    console.error('Get lobbies error:', error);
    res.status(500).json({ error: 'Failed to get lobbies' });
  }
});

// Get lobby by ID
router.get('/lobby/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const lobby = await Lobby.findById(id);
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    // Check if user is a member
    const isMember = lobby.members.some(member => member.uid === user.uid);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ lobby });
  } catch (error) {
    console.error('Get lobby error:', error);
    res.status(500).json({ error: 'Failed to get lobby' });
  }
});

export default router;