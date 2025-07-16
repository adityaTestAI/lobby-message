import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { auth } from '../../config/firebase';

interface JoinLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLobbyJoined: () => void;
}

export const JoinLobbyModal: React.FC<JoinLobbyModalProps> = ({
  isOpen,
  onClose,
  onLobbyJoined
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/lobby/join', { inviteCode }, token);
      onLobbyJoined();
      onClose();
      setInviteCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to join lobby');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Lobby">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <Input
          label="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Enter invite code"
          required
        />

        <div className="flex space-x-3">
          <Button type="submit" loading={loading} className="flex-1">
            Join Lobby
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};