import { Router } from 'express';

const router = Router();

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';

import authenticationUser from '../middlewares/authentication.middleware.js';
import { authorizationUser } from '../middlewares/authorization.middleware.js';
import { ROLES } from '../config/global.config.js';
import uploadAvatar from '../middlewares/upload.middleware.js';


// Definicion de las rutas para los usuarios (ADMIN), para acceder a ellas deberiamos entonces usar la siguiente ruta --> http://localhost:3000/api/users
router.get(
    '/',
    //[authenticationUser, authorizationUser([ ROLES.ADMIN ])], 
    getUsers
);
router.post('/',
    //[authenticationUser, authorizationUser([ROLES.ADMIN])], 
    uploadAvatar.single('avatarUrl'),
    createUser
);
router.get(
    '/:id',
    // [authenticationUser, authorizationUser([ ROLES.ADMIN ])], 
    getUserById
);
router.patch(
    '/:id',
    // authenticationUser, authorizationUser([ ROLES.ADMIN ]), 
    uploadAvatar.single('avatarUrl'),
    updateUser
);
router.delete(
    '/:id',
    // authenticationUser, authorizationUser([ ROLES.ADMIN ]), 
    deleteUser
);


export default router;