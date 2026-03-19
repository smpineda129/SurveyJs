import express from 'express';
import { login, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, me);

export default router;
