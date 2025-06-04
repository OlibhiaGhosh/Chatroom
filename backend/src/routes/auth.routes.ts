import express from 'express';
import { signup, login, updateUser, changePassword, deleteUser } from '../controllers/auth.controller';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.put('/update/:id', updateUser); //Add middleware to protect this route using jwt session in middleware
router.put('/change-password/:id', changePassword); //Add middleware to protect this route using jwt session in middleware
router.delete('/delete/:id', deleteUser); //Add middleware to protect this route using jwt session in middleware
export default router;