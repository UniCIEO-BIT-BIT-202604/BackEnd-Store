import { Router } from 'express';

const router = Router();

import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';


// Definicion de las rutas para los usuarios
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;