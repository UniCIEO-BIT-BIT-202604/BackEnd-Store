import { Router } from 'express';
import { createUser } from '../controllers/user.controller.js';

const router = Router();

// Define las rutas que manejan el flujo de la autenticacion (USER)
// /login
router.post( '/register', createUser ); // http://localhost:3000/api/auth/register

// /remember-password
// /remember-user
// /renew-token
// /activated-account
// /deactivated-account
// /double-authentication


export default router;