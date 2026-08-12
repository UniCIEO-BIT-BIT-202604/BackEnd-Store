import { Router } from 'express';

const router = Router();

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';

import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';
import { ROLES } from '../config/global.config.js';



// Definicion de las rutas para los usuarios (ADMIN)
router.get(
    '/',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN])],
    getUsers
);
router.post(
    '/',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN])],
    createUser
);           // http://localhost:3000/api/users
router.get(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN])],
    getUserById
);
router.patch(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN])],
    updateUser
);
router.delete(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN])],
    deleteUser
);


export default router;