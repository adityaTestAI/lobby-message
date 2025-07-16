import express from 'express';

const router = express.Router();

// Demo auth endpoint - in production, this would verify Firebase tokens
router.post('/verify', async (req, res) => {
  try {
    // In production, verify Firebase token here
    res.json({ 
      success: true, 
      user: {
        uid: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@example.com'
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;