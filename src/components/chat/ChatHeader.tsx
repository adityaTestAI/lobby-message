import React, { useState } from 'react';
import { ArrowLeft, Users, Settings, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Lobby, LobbyMember } from '../../types';
import { MembersModal } from './MembersModal';

interface ChatHeaderProps {
  lobby: Lobby;
  currentUserRole: string;
  onBack: () => void;
  onKickMember: (uid: string) => void;
  onAssignModerator: (uid: string) => void;
  onInvite: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  lobby,
  currentUserRole,
  onBack,
  onKickMember,
  onAssignModerator,
  onInvite
}) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{lobby.name}</h2>
            <p className="text-sm text-gray-500">{lobby.members.length} members</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onInvite}
            icon={<LinkIcon className="w-4 h-4" />}
          >
            Invite
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMembers(true)}
            icon={<Users className="w-4 h-4" />}
          >
            Members
          </Button>
        </div>
      </div>

      <MembersModal
        isOpen={showMembers}
        onClose={() => setShowMembers(false)}
        lobby={lobby}
        currentUserRole={currentUserRole}
        onKickMember={onKickMember}
        onAssignModerator={onAssignModerator}
      />
    </>
  );
};