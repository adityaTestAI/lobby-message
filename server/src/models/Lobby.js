import mongoose from 'mongoose';

const lobbyMemberSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  photoURL: { type: String },
  role: { type: String, enum: ['creator', 'moderator', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
});

const lobbySchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
  members: [lobbyMemberSchema],
  inviteCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export const Lobby = mongoose.model('Lobby', lobbySchema);