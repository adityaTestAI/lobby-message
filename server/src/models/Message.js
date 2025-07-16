import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  lobbyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lobby', required: true },
  sender: {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    photoURL: { type: String }
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);