import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();
router.post('/send-message/:id', authMiddleware, sendMessage); //here :id is the userId
router.get('/get-messages/:id', authMiddleware, getMessages); //here :id is the chatroomId

export default router;