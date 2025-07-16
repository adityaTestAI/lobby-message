import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { auth } from '../config/firebase';
import { Users, ArrowLeft } from 'lucide-react';

export const JoinLobby: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (inviteCode && user) {
      handleJoinLobby();
    }
  }, [inviteCode, user]);

  const handleJoinLobby = async () => {
    if (!user || !inviteCode) return;

    setLoading(true);
    setError('');

    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/lobby/join', { inviteCode }, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to join lobby');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in to join a lobby</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Join Lobby</h2>
            <p className="text-gray-600 mt-2">
              {loading ? 'Joining lobby...' : error ? 'Failed to join lobby' : 'Ready to join!'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Dashboard
            </Button>
            
            {error && (
              <Button
                onClick={handleJoinLobby}
                loading={loading}
                className="flex-1"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};