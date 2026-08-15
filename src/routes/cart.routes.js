import { Router } from 'express';
import {
    getCart,
    updateCart,
    syncCart,
    removeItemFromCart,
    clearCart
} from '../controllers/cart.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const cartRouter = Router();

// Todas las rutas del carrito están protegidas para usuarios autenticados
cartRouter.use(authenticationUser);

cartRouter.get('/', getCart);
cartRouter.put('/', updateCart);
cartRouter.post('/sync', syncCart);
cartRouter.delete('/item/:productId', removeItemFromCart);
cartRouter.delete('/', clearCart);

export default cartRouter;
