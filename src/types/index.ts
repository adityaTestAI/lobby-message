export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface Lobby {
  _id: string;
  name: string;
  creator: string;
  members: LobbyMember[];
  inviteCode: string;
  createdAt: Date;
}

export interface LobbyMember {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'creator' | 'moderator' | 'member';
  joinedAt: Date;
}

export interface Message {
  _id: string;
  lobbyId: string;
  sender: {
    uid: string;
    name: string;
    photoURL?: string;
  };
  content: string;
  timestamp: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}