import React, { useState } from 'react';
import { MessageCircle, Users, Link as LinkIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuth(true);
    }
  };

  const handleJoinChat = () => {
    if (user) {
      navigate('/join');
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-lg">
              <MessageCircle className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">ChatFlow</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with friends, colleagues, and communities through our modern, 
            real-time chat platform. Create lobbies, manage teams, and chat with style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              onClick={handleStartChat}
              size="lg"
              className="w-full sm:w-auto"
              icon={<MessageCircle className="w-5 h-5" />}
            >
              Start Chat
            </Button>
            
            <Button
              onClick={handleJoinChat}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<Users className="w-5 h-5" />}
            >
              Join a Chat
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Chat</h3>
            <p className="text-gray-600">
              Experience lightning-fast messaging with our real-time chat system powered by Socket.io
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Role Management</h3>
            <p className="text-gray-600">
              Organize your chats with creator, moderator, and member roles with different permissions
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Invites</h3>
            <p className="text-gray-600">
              Share invite links to quickly add new members to your chat lobbies
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={showAuth} onClose={() => setShowAuth(false)} title="Authentication">
        <AuthForm onClose={() => setShowAuth(false)} />
      </Modal>
    </div>
  );
};