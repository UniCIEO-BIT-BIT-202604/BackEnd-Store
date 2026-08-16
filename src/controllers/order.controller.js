import { dbCreateOrder, dbGetOrdersByUserId, dbGetOrderById } from '../services/order.service.js';

/**
 * Crea una nueva orden de compra para el usuario autenticado.
 */
const createOrder = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { shippingAddress } = req.body;

        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
            return res.status(400).json({
                msg: 'La dirección de envío (dirección, ciudad y teléfono) es obligatoria'
            });
        }

        const newOrder = await dbCreateOrder(userId, req.body);

        res.status(201).json({
            msg: 'Orden de compra creada exitosamente',
            data: newOrder
        });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(400).json({
            msg: error.message || 'Error al procesar la orden de compra'
        });
    }
};

/**
 * Obtiene el historial de órdenes del usuario autenticado.
 */
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const orders = await dbGetOrdersByUserId(userId);

        res.json({
            msg: 'Historial de órdenes obtenido con éxito',
            data: orders
        });
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({
            msg: 'Error interno del servidor al obtener las órdenes'
        });
    }
};

/**
 * Obtiene el detalle de una orden por su ID.
 */
const getOrderById = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { id } = req.params;

        const order = await dbGetOrderById(id, userId);

        if (!order) {
            return res.status(404).json({
                msg: 'Orden no encontrada o no pertenece al usuario'
            });
        }

        res.json({
            msg: 'Detalle de la orden obtenido con éxito',
            data: order
        });
    } catch (error) {
        console.error('Error al obtener la orden por ID:', error);
        res.status(500).json({
            msg: 'Error interno del servidor al obtener el detalle de la orden'
        });
    }
};

export {
    createOrder,
    getUserOrders,
    getOrderById
};
