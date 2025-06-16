import express from 'express';
import { loginUser, registerUser } from '../controllers/auth_controller.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;


