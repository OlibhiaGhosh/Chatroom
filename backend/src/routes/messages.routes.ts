import express from 'express';
import { addMessage, getMessages } from '../controllers/message.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();
router.post('/messages/:id', authMiddleware, addMessage);
router.get('/messages/:id', authMiddleware, getMessages);

export default router;