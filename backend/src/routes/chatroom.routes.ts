import express from 'express';
import { createChatroom, getChatroomData, getChatrooms, deleteChatroom} from '../controllers/chatrooms.controller';
const router = express.Router();
router.post('/create_chatroom', createChatroom); //Add middleware to protect this route using jwt session in middleware
router.post('/get_chatroomdata/?id', getChatroomData); //Add middleware to protect this route using jwt session in middleware
router.post('/get_chatrooms', getChatrooms); //Add middleware to protect this route using jwt session in middleware
router.delete('/delete_chatroom', deleteChatroom); //Add middleware to protect this route using jwt session in middleware
export default router;