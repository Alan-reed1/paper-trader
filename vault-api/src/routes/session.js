import express from "express";
import { logout, refreshToken } from '../controllers/session_controller.js'

const router = express.Router();

router.post('/logout', logout);
router.post('/refreshToken', refreshToken);

export default router;