import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/order.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';

const orderRouter = Router();

// Todas las rutas de órdenes están protegidas con autenticación JWT
orderRouter.use(authenticationUser);

orderRouter.post('/', createOrder);
orderRouter.get('/', getUserOrders);
orderRouter.get('/:id', getOrderById);

export default orderRouter;
