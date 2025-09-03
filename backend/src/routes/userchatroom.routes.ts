import express from 'express';
import { joinUserChatroomTable, getChatroomfromUserChatroomTable, deleteChatroom } from '../controllers/userChatroom.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();
router.post('/join-userChatroom', authMiddleware, joinUserChatroomTable);
router.post('/get-userChatroom', authMiddleware, getChatroomfromUserChatroomTable);
router.delete('/delete-chatroom/:id', authMiddleware, deleteChatroom);
export default router;