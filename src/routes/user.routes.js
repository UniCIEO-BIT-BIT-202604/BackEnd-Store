import { Router } from 'express';

const router = Router();

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';

import authenticationUser from '../middlewares/authentication.middleware.js';


// Definicion de las rutas para los usuarios (ADMIN)
router.get('/', authenticationUser, getUsers);
router.get('/:id', authenticationUser, getUserById);
router.post('/', authenticationUser, createUser);           // http://localhost:3000/api/users
router.patch('/:id', authenticationUser, updateUser);
router.delete('/:id', authenticationUser, deleteUser);


export default router;