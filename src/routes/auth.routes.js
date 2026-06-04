import { Router } from 'express';

import { createUser } from '../controllers/user.controller.js';
import { loginUser } from '../controllers/auth.controller.js';

const router = Router();

// Define las rutas que manejan el flujo de la autenticacion (USER)

// http://localhost:3000/api/auth
router.post( '/login', loginUser );        // /login
router.post( '/register', createUser );     // /register 

// /renew-token
// /remember-password
// /remember-user
// /activated-account
// /deactivated-account
// /double-authentication


export default router;