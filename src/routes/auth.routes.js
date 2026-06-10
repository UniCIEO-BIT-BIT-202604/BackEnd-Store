import { Router } from 'express';

import { createUser } from '../controllers/user.controller.js';
import { loginUser, reNewToken } from '../controllers/auth.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const router = Router();

// Define las rutas que manejan el flujo de la autenticacion (USER)

// http://localhost:3000/api/auth
router.post( '/login', loginUser );        // /login
router.post( '/register', createUser );     // /register 
router.get( '/renew-token', authenticationUser, reNewToken );


// /remember-password
// /remember-user
// /activated-account
// /deactivated-account
// /double-authentication


export default router;