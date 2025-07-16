import { Message } from '../models/Message.js';
import { Lobby } from '../models/Lobby.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    socket.on('join-lobby', async (lobbyId) => {
      try {
        socket.join(lobbyId);
        console.log(`👤 User ${socket.id} joined lobby ${lobbyId}`);
      } catch (error) {
        console.error('Join lobby error:', error);
      }
    });

    socket.on('leave-lobby', (lobbyId) => {
      socket.leave(lobbyId);
      console.log(`👤 User ${socket.id} left lobby ${lobbyId}`);
    });

    socket.on('send-message', async (data) => {
      try {
        const { lobbyId, content, sender } = data;

        // Verify user is member of lobby
        const lobby = await Lobby.findById(lobbyId);
        if (!lobby || !lobby.members.some(member => member.uid === sender.uid)) {
          return;
        }

        const message = new Message({
          lobbyId,
          sender,
          content
        });

        await message.save();

        // Broadcast to all users in the lobby
        io.to(lobbyId).emit('new-message', message);
      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('👤 User disconnected:', socket.id);
    });
  });
};