import { Router } from 'express';

const router = Router();

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';


// Definicion de las rutas para los usuarios (ADMIN)
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);           // http://localhost:3000/api/users
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;