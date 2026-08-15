import {
    dbGetCartByUserId,
    dbUpdateCart,
    dbSyncCart,
    dbRemoveItemFromCart,
    dbClearCart
} from '../services/cart.service.js';

/**
 * Obtiene el carrito del usuario autenticado.
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const cart = await dbGetCartByUserId(userId);

        res.json({
            msg: 'Carrito obtenido con éxito',
            data: cart
        });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({
            msg: 'Error interno del servidor al obtener el carrito'
        });
    }
};

/**
 * Actualiza los productos del carrito del usuario autenticado.
 */
const updateCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({
                msg: 'El cuerpo de la petición debe contener un arreglo de ítems válido'
            });
        }

        const cart = await dbUpdateCart(userId, items);

        res.json({
            msg: 'Carrito actualizado con éxito',
            data: cart
        });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({
            msg: 'Error interno del servidor al actualizar el carrito'
        });
    }
};

/**
 * Sincroniza y fusiona (Merge) el carrito anónimo del localStorage con la base de datos tras el login.
 */
const syncCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { items } = req.body;

        const guestItems = Array.isArray(items) ? items : [];
        const cart = await dbSyncCart(userId, guestItems);

        res.json({
            msg: 'Carrito sincronizado con éxito',
            data: cart
        });
    } catch (error) {
        console.error('Error al sincronizar el carrito:', error);
        res.status(500).json({
            msg: 'Error interno del servidor al sincronizar el carrito'
        });
    }
};

/**
 * Elimina un producto específico del carrito del usuario autenticado.
 */
const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { productId } = req.params;

        const cart = await dbRemoveItemFromCart(userId, productId);

        res.json({
            msg: 'Producto eliminado del carrito con éxito',
            data: cart
        });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({
            msg: 'Error interno del servidor al eliminar el producto'
        });
    }
};

/**
 * Vacía completamente el carrito del usuario autenticado.
 */
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const cart = await dbClearCart(userId);

        res.json({
            msg: 'Carrito vaciado con éxito',
            data: cart
        });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({
            msg: 'Error interno del servidor al vaciar el carrito'
        });
    }
};

export {
    getCart,
    updateCart,
    syncCart,
    removeItemFromCart,
    clearCart
};
