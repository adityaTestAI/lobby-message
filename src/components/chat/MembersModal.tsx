import React from 'react';
import { Crown, Shield, Users, MoreVertical } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Lobby, LobbyMember } from '../../types';

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  lobby: Lobby;
  currentUserRole: string;
  onKickMember: (uid: string) => void;
  onAssignModerator: (uid: string) => void;
}

export const MembersModal: React.FC<MembersModalProps> = ({
  isOpen,
  onClose,
  lobby,
  currentUserRole,
  onKickMember,
  onAssignModerator
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

  const canKick = (member: LobbyMember) => {
    if (currentUserRole === 'creator') return member.role !== 'creator';
    if (currentUserRole === 'moderator') return member.role === 'member';
    return false;
  };

  const canAssignModerator = (member: LobbyMember) => {
    return currentUserRole === 'creator' && member.role === 'member';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Members">
      <div className="space-y-4">
        {lobby.members.map((member) => (
          <div key={member.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {member.photoURL && (
                <img 
                  src={member.photoURL} 
                  alt={member.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  {getRoleIcon(member.role)}
                  <span className="capitalize">{member.role}</span>
                </div>
              </div>
            </div>

            {(canKick(member) || canAssignModerator(member)) && (
              <div className="flex items-center space-x-2">
                {canAssignModerator(member) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAssignModerator(member.uid)}
                  >
                    Make Moderator
                  </Button>
                )}
                
                {canKick(member) && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onKickMember(member.uid)}
                  >
                    Kick
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};