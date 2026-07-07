import { Router } from 'express';

import getRoles from '../controllers/roles.controller.js';

const router = Router();

// Obtener todos los roles
router.get( '/', getRoles );


export default router;