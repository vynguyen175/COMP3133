# Real-Time Chat Application

A full-featured real-time chat application built with Node.js, Express, Socket.io, and MongoDB. This application supports both group chat and private messaging with real-time updates.

## Features

- **User Authentication**: Secure signup and login functionality with password hashing using bcryptjs
- **Group Chat**: Real-time group messaging in different chat rooms
- **Private Messaging**: Send direct messages to other online users
- **Online User Tracking**: See all currently active users in the system
- **Typing Indicator**: View when other users are typing
- **User Management**: Join/leave rooms and disconnect gracefully
- **Message Persistence**: All messages are stored in MongoDB for history

## Tech Stack

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.io
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcryptjs for password hashing
- **Frontend**: HTML5, CSS3, JavaScript

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB running locally or accessible connection string

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
PORT=9000
MONGODB_URI=mongodb://localhost:27017/comp3133-chat
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:9000
```

## Usage

### Signup
Create a new account to get started.

![Signup Page](./signup.png)

### Login
Sign in with your credentials.

![Login Page](./signin.png)

### Group Chat
Join a chat room and communicate with multiple users in real-time. You can see all users currently in the room and view their typing status.

![Live Chat Interface](./livechat.png)

### Private Messaging
Send direct messages to other online users. Only the recipient can see these private conversations.

![Private Message Feature](./private_message.png)

### Logout
Safely disconnect from the application.

![Logout Functionality](./logout.png)

## Database Structure

### MongoDB Collections

**Users**: Stores user credentials (hashed passwords)
- username
- password (hashed)

**GroupMessages**: Stores all group chat messages
- from_user
- room
- message
- date_sent

**PrivateMessages**: Stores direct messages between users
- from_user
- to_user
- message
- date_sent

![MongoDB Database](./mongo.png)

## Architecture

### Backend Structure
- **server.js**: Main application entry point with Socket.io handlers
- **config/db.js**: MongoDB connection configuration
- **models/**: Mongoose schemas for GroupMessage, PrivateMessage, and User
- **routes/**: Express routes for authentication and message operations
  - authRoutes.js: User signup/login endpoints
  - messageRoutes.js: Message retrieval endpoints

### Socket.io Events
- `register_user`: Register username on connection
- `join_room`: Join a specific chat room
- `send_group_message`: Send message to all users in a room
- `send_private_message`: Send direct message to another user
- `typing`: Notify users that someone is typing
- `stop_typing`: Notify users that typing has stopped
- `leave_room`: Leave the current room
- `disconnect`: Handle user disconnection

## Project Information

**Course**: COMP3133
**Student ID**: 101488823
**Version**: 1.0.0

## License

ISC
