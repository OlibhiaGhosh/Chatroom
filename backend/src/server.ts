import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import chatroomRoutes from "./routes/chatroom.routes"

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve Vite build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatroom', chatroomRoutes);

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
