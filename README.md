# ChatConnect

ChatConnect is a full-stack, real-time chat application designed for instant and private communication. It allows users to sign up, log in, create chatrooms, and engage in live conversations with others. The project features a modern, responsive frontend built with React and Tailwind CSS, and a robust backend powered by Node.js, Express, and Prisma with a PostgreSQL database. Real-time functionality is handled seamlessly with Socket.io.

![ChatConnect Dashboard](https://user-images.githubusercontent.com/12345/placeholder.png) <!-- Replace with an actual screenshot -->

## ✨ Features

- **User Authentication**: Secure user registration and login system with password hashing (`bcryptjs`).
- **JWT Authorization**: Uses JSON Web Tokens (Access and Refresh Tokens) for securing API endpoints. Refresh tokens are stored in `HttpOnly` cookies for enhanced security.
- **Chatroom Management**:
  - Users can create new chatrooms with a name and description.
  - A unique, shareable link is generated for each new chatroom.
  - Users can join chatrooms they are invited to.
  - View a personalized dashboard of all joined chatrooms.
  - Leave/delete chatrooms from the dashboard.
- **Real-Time Communication**:
  - Live messaging within chatrooms powered by **Socket.io**.
  - Real-time notifications when users join a room.
- **Responsive UI**: A clean, modern, and dark-themed interface built with **Tailwind CSS** that works seamlessly on all screen sizes.
- **RESTful API**: A well-structured backend API for managing users, chatrooms, and messages.

## 🛠️ Tech Stack

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Real-time Communication**: [Socket.io](https://socket.io/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Middleware**: [CORS](https://www.npmjs.com/package/cors), [cookie-parser](https://www.npmjs.com/package/cookie-parser)

### Frontend

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Real-time Communication**: [Socket.io Client](https://socket.io/docs/v4/client-api/)
- **State Management**: React Context API
- **UI Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Database

- **Database**: [PostgreSQL](https://www.postgresql.org/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18 or later recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following variables. Replace the placeholder values with your actual database connection string and a secure secret.

    ```env
    DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"
    JWT_SECRET="your_super_secret_jwt_key"
    ```

4.  **Run database migrations:**
    This will set up the database schema based on the Prisma model.
    ```bash
    npx prisma migrate dev
    ```

5.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend server will be running on `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

## 📜 Available Scripts

### Backend (`/backend`)

-   `npm start`: Starts the development server with `nodemon` and `ts-node`.
-   `npm run build`: Compiles the TypeScript code to JavaScript in the `dist` folder.

### Frontend (`/frontend`)

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the source code using ESLint.
-   `npm run preview`: Serves the production build locally for preview.

## 📁 Project Structure

The project is organized into two main directories: `frontend` and `backend`.

```
Chatroom/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma     # Database schema definition
│   ├── src/
│   │   ├── controllers/      # Request handlers and business logic
│   │   ├── lib/              # Socket.io setup
│   │   ├── middleware/       # Custom Express middleware (e.g., auth)
│   │   ├── routes/           # API route definitions
│   │   ├── utils/            # Utility functions (e.g., JWT generation)
│   │   └── index.ts          # Main server entry point
│   ├── .env                  # Environment variables (local)
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── axios/            # Axios instances (default and private)
    │   ├── components/       # React components
    │   ├── context/          # Auth context provider
    │   ├── hooks/            # Custom React hooks
    │   ├── App.jsx           # Main app component with routing
    │   └── main.jsx          # Application entry point
    ├── tailwind.config.js    # Tailwind CSS configuration
    └── vite.config.js        # Vite configuration
```

## 🗄️ Database Schema

The database schema is defined in `backend/prisma/schema.prisma` and consists of four models:

-   **`User`**: Stores user credentials and personal information.
-   **`Chatroom`**: Contains details about each chatroom, including its name, creator, and a JSON array of current members.
-   **`UserChatroom`**: A many-to-many relation table connecting users to the chatrooms they've joined. It ensures a user can only join a specific chatroom once (`@@unique([userId, chatroomId])`).
-   **`message`**: Stores all messages for a given chatroom. The `content` field is a JSON array where each element represents a single message object (`{message, user_id, username, timestamp}`).

Relationships are set up with `onDelete: Cascade` to ensure that when a `User` or `Chatroom` is deleted, all related `UserChatroom` and `message` entries are also automatically removed, maintaining data integrity.

## 📡 API Endpoints

All API routes are prefixed with `/api`.

### Authentication (`/auth`)

-   `POST /signup`: Register a new user.
-   `POST /login`: Log in a user and receive access/refresh tokens.
-   `POST /logout`: Log out a user and clear the refresh token.
-   `GET /refresh-token`: Obtain a new access token using the refresh token cookie.
-   `POST /getUserdata`: (Protected) Get the authenticated user's data.
-   `PUT /update/:id`: (Protected) Update user details.
-   `PUT /change-password/:id`: (Protected) Change user password.
-   `DELETE /delete/:id`: (Protected) Delete a user account.

### Chatrooms (`/chatroom`)

-   `POST /create-chatroom`: (Protected) Create a new chatroom.
-   `POST /get-chatroomdatabyChatroomid/:id`: (Protected) Get details for a specific chatroom.
-   `POST /get-chatroomdatabyCreatorid`: (Protected) Get all chatrooms created by the authenticated user.
-   `POST /join-chatroom/:id`: (Protected) Add the authenticated user to a chatroom's member list.

### Messages (`/messages`)

-   `POST /send-message/:id`: (Protected) Send a message to a chatroom (`:id` is the chatroom ID).
-   `GET /get-messages/:id`: (Protected) Retrieve all messages for a chatroom (`:id` is the chatroom ID).

### User-Chatroom Relations (`/userchatroom`)

-   `POST /join-userChatroom`: (Protected) Creates an entry in the `UserChatroom` table to signify a user has joined a room.
-   `POST /get-userChatroom`: (Protected) Get all chatrooms the authenticated user is a member of.
-   `DELETE /delete-chatroom/:id`: (Protected) Removes a user from a chatroom (deletes the `UserChatroom` entry).

## 💬 Real-time Events (Socket.io)

Socket.io is used for real-time, bidirectional communication between the client and server.

### Client Emits

-   `join_room`: Sent when a user enters a chatroom page.
    -   Payload: `{ roomId, userId, username }`
-   `disconnected`: Sent when a user leaves a chatroom page.
    -   Payload: `{ roomId, userId, username }`

### Server Emits

-   `user_joined`: Broadcast to all clients in a room when a new user joins.
    -   Payload: `{ roomId, userId, username, message }`
-   `new_message`: Broadcast to all clients in a room when a new message is sent.
    -   Payload: `{ roomId, userId, username, content }`
-   `user_disconnected`: Broadcast to all clients in a room when a user disconnects.
    -   Payload: `{ roomId, userId, username, message }`
