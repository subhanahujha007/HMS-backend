import express from 'express';
import { login, signup } from '../Controllers/Authcontroller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
