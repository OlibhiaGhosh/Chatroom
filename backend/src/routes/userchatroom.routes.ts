import express from 'express';
import { joinUserChatroomTable, getChatroomfromUserChatroomTable } from '../controllers/userChatroom.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();
router.post('/join-userChatroom', authMiddleware, joinUserChatroomTable);
router.post('/get-userChatroom', authMiddleware, getChatroomfromUserChatroomTable);
export default router;