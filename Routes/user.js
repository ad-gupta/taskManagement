import express from 'express';
import { loginUser, logout, registerUser, getMyDetails } from '../Controllers/user.js';
import { isAuthorised } from '../Middleware/auth.js';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(logout);

router.route('/me').get(isAuthorised, getMyDetails)

export default router;