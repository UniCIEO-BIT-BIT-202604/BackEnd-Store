import { Router } from 'express';

const router = Router();

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';

import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';
import { ROLES } from '../config/global.config.js';
import { handleUploadAvatar } from '../middlewares/handleUploadAvatar.middleware.js';

// Definicion de las rutas para los usuarios (SUPER_ADMIN, ADMIN)
router.get(
    '/',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN])],
    getUsers
);

router.post(
    '/',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN]), handleUploadAvatar],
    createUser
);

router.get(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN])],
    getUserById
);

router.patch(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN]), handleUploadAvatar],
    updateUser
);

router.delete(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN])],
    deleteUser
);

export default router;