import React from 'react';
import { Users, Crown, Shield, Calendar } from 'lucide-react';
import { Lobby, LobbyMember } from '../../types';
import { Button } from '../ui/Button';

interface LobbyCardProps {
  lobby: Lobby;
  currentUserRole: string;
  onEnterLobby: (lobbyId: string) => void;
  onLeaveLobby: (lobbyId: string) => void;
  onDeleteLobby: (lobbyId: string) => void;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({
  lobby,
  currentUserRole,
  onEnterLobby,
  onLeaveLobby,
  onDeleteLobby
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'creator':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'creator':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{lobby.name}</h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(currentUserRole)}`}>
              {getRoleIcon(currentUserRole)}
              <span className="ml-1 capitalize">{currentUserRole}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          {lobby.members.length} members
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4 mr-1" />
        Created {new Date(lobby.createdAt).toLocaleDateString()}
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={() => onEnterLobby(lobby._id)}
          className="flex-1"
        >
          Enter Chat
        </Button>
        
        {currentUserRole === 'creator' ? (
          <Button
            variant="danger"
            onClick={() => onDeleteLobby(lobby._id)}
          >
            Delete
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => onLeaveLobby(lobby._id)}
          >
            Leave
          </Button>
        )}
      </div>
    </div>
  );
};