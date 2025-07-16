import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageItem } from '../components/chat/MessageItem';
import { ChatInput } from '../components/chat/ChatInput';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { socket, connectSocket } from '../utils/socket';
import { auth } from '../config/firebase';
import { Lobby, Message } from '../types';

export const Chat: React.FC = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && lobbyId) {
      fetchLobby();
      fetchMessages();
      setupSocket();
    }

    return () => {
      if (socket.connected) {
        socket.emit('leave-lobby', lobbyId);
      }
    };
  }, [user, lobbyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchLobby = async () => {
    if (!user || !lobbyId) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await api.get(`/lobby/${lobbyId}`, token);
      setLobby(response.lobby);
    } catch (error) {
      console.error('Failed to fetch lobby:', error);
      navigate('/dashboard');
    }
  };

  const fetchMessages = async () => {
    if (!user || !lobbyId) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await api.get(`/messages/${lobbyId}`, token);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    if (!user || !lobbyId) return;

    connectSocket(user.uid);
    socket.emit('join-lobby', lobbyId);

    socket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('member-kicked', (data: { uid: string }) => {
      if (data.uid === user.uid) {
        navigate('/dashboard');
      } else {
        fetchLobby();
      }
    });

    socket.on('lobby-deleted', () => {
      navigate('/dashboard');
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !lobbyId) return;

    const message = {
      lobbyId,
      content,
      sender: {
        uid: user.uid,
        name: user.name,
        photoURL: user.photoURL
      }
    };

    socket.emit('send-message', message);
  };

  const handleKickMember = async (uid: string) => {
    if (!user || !lobbyId) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/lobby/kick', { lobbyId, uid }, token);
      fetchLobby();
    } catch (error) {
      console.error('Failed to kick member:', error);
    }
  };

  const handleAssignModerator = async (uid: string) => {
    if (!user || !lobbyId) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/lobby/assign-moderator', { lobbyId, uid }, token);
      fetchLobby();
    } catch (error) {
      console.error('Failed to assign moderator:', error);
    }
  };

  const handleInvite = async () => {
    if (!lobby) return;

    const inviteUrl = `${window.location.origin}/join/${lobby.inviteCode}`;
    await navigator.clipboard.writeText(inviteUrl);
    alert('Invite link copied to clipboard!');
  };

  const getCurrentUserRole = () => {
    if (!lobby || !user) return 'member';
    const member = lobby.members.find(m => m.uid === user.uid);
    return member?.role || 'member';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!lobby) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lobby not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader
        lobby={lobby}
        currentUserRole={getCurrentUserRole()}
        onBack={() => navigate('/dashboard')}
        onKickMember={handleKickMember}
        onAssignModerator={handleAssignModerator}
        onInvite={handleInvite}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              isCurrentUser={message.sender.uid === user?.uid}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};