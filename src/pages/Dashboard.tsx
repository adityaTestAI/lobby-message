import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LobbyCard } from '../components/lobby/LobbyCard';
import { CreateLobbyModal } from '../components/lobby/CreateLobbyModal';
import { JoinLobbyModal } from '../components/lobby/JoinLobbyModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { auth } from '../config/firebase';
import { Lobby } from '../types';

export const Dashboard: React.FC = () => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchLobbies();
    }
  }, [user]);

  const fetchLobbies = async () => {
    if (!user) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await api.get(`/lobbies/${user.uid}`, token);
      setLobbies(response.lobbies);
    } catch (error) {
      console.error('Failed to fetch lobbies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterLobby = (lobbyId: string) => {
    navigate(`/chat/${lobbyId}`);
  };

  const handleLeaveLobby = async (lobbyId: string) => {
    if (!user) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/lobby/leave', { lobbyId }, token);
      fetchLobbies();
    } catch (error) {
      console.error('Failed to leave lobby:', error);
    }
  };

  const handleDeleteLobby = async (lobbyId: string) => {
    if (!user) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      await api.delete(`/lobby/${lobbyId}`, token);
      fetchLobbies();
    } catch (error) {
      console.error('Failed to delete lobby:', error);
    }
  };

  const getCurrentUserRole = (lobby: Lobby) => {
    const member = lobby.members.find(m => m.uid === user?.uid);
    return member?.role || 'member';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your lobbies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-gray-700">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Chat Lobbies</h2>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowJoinModal(true)}
                variant="outline"
                icon={<Users className="w-4 h-4" />}
              >
                Join Lobby
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Lobby
              </Button>
            </div>
          </div>

          {lobbies.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lobbies yet</h3>
              <p className="text-gray-600 mb-4">Create your first lobby or join an existing one</p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Your First Lobby
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lobbies.map((lobby) => (
                <LobbyCard
                  key={lobby._id}
                  lobby={lobby}
                  currentUserRole={getCurrentUserRole(lobby)}
                  onEnterLobby={handleEnterLobby}
                  onLeaveLobby={handleLeaveLobby}
                  onDeleteLobby={handleDeleteLobby}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateLobbyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onLobbyCreated={fetchLobbies}
      />

      <JoinLobbyModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onLobbyJoined={fetchLobbies}
      />
    </div>
  );
};