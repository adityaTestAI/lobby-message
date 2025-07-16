# ChatFlow - Real-Time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Socket.io, and MongoDB.

## Features

- **Real-time Messaging**: Instant messaging with Socket.io
- **Role-Based Access Control**: Creator, moderator, and member roles with different permissions
- **Firebase Authentication**: Google Sign-in and Email/Password authentication
- **Lobby Management**: Create, join, and manage chat lobbies
- **Invite System**: Share invite links to add new members
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Message History**: Persistent message storage with MongoDB

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Socket.io Client for real-time communication
- Firebase Authentication

### Backend
- Node.js with Express
- Socket.io for real-time messaging
- MongoDB with Mongoose
- Firebase Admin SDK for authentication
- CORS enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Firebase project with Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatflow
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   
   **Frontend (.env):**
   ```bash
   cp .env.example .env
   ```
   Update with your Firebase configuration.

   **Backend (server/.env):**
   ```bash
   cd server
   cp .env.example .env
   ```
   Update with your MongoDB URI and Firebase service account details.

5. **Start the development servers**
   
   **Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend (new terminal):**
   ```bash
   npm run dev
   ```

## User Roles and Permissions

### Creator
- Can delete the lobby
- Can kick any member
- Can assign moderators
- Can send messages

### Moderator
- Can kick members (not creator or other moderators)
- Can send messages
- Cannot delete lobby

### Member
- Can send messages
- Can leave the lobby
- Cannot kick anyone

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token

### Lobbies
- `POST /api/lobby/create` - Create new lobby
- `POST /api/lobby/join` - Join lobby with invite code
- `POST /api/lobby/leave` - Leave lobby
- `POST /api/lobby/kick` - Kick member (moderator/creator only)
- `POST /api/lobby/assign-moderator` - Assign moderator (creator only)
- `DELETE /api/lobby/:id` - Delete lobby (creator only)
- `GET /api/lobbies/:userId` - Get user's lobbies
- `GET /api/lobby/:id` - Get lobby details

### Messages
- `GET /api/messages/:lobbyId` - Get lobby messages
- `POST /api/messages/:lobbyId` - Send message

## Socket Events

### Client to Server
- `join-lobby` - Join a lobby room
- `leave-lobby` - Leave a lobby room
- `send-message` - Send a message

### Server to Client
- `new-message` - Receive new message
- `member-kicked` - User was kicked from lobby
- `lobby-deleted` - Lobby was deleted

## Production Deployment

### Frontend
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

### Backend
1. Set up environment variables on your server
2. Install dependencies:
   ```bash
   npm install --production
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Security Features

- Firebase Authentication for secure user management
- Role-based access control for lobby actions
- Input validation and sanitization
- CORS configuration for cross-origin requests
- JWT token verification for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.