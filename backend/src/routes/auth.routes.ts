import express from 'express';
import { signup, login, updateUser, changePassword, deleteUser, getUserdata , getUserdatabyId, logout, refreshToken} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/getUserdata', authMiddleware, getUserdata);
router.post('/getUserdatabyId/:id', authMiddleware, getUserdatabyId);
router.put('/update/:id', authMiddleware, updateUser);
router.put('/change-password/:id', authMiddleware, changePassword);
router.delete('/delete/:id', authMiddleware, deleteUser);
router.post('/logout', authMiddleware, logout)
router.post('/refresh-token', refreshToken)
export default router;