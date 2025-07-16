import { admin } from '../config/firebase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // For demo purposes, we'll create a mock user
    // In production, uncomment the Firebase auth code below
    
    /* 
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
      email: decodedToken.email,
      photoURL: decodedToken.picture
    };
    */

    // Demo user for testing
    req.user = {
      uid: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};