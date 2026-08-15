import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

/**
 * Obtiene el carrito de compras de un usuario por su ID.
 * Si el usuario no tiene carrito registrado, crea uno vacío.
 */
const dbGetCartByUserId = async (userId) => {
    let cart = await CartModel.findOne({ user: userId }).populate('items.product');
    if (!cart) {
        cart = await CartModel.create({ user: userId, items: [] });
    }
    return cart;
};

/**
 * Actualiza los elementos del carrito del usuario validando:
 * 1. Que la cantidad sea mayor a 0 (si es <= 0 se descarta).
 * 2. Que el producto exista y esté activo en la tienda.
 * 3. Que la cantidad no supere el stock disponible (se ajusta automáticamente al límite máximo disponible).
 */
const dbUpdateCart = async (userId, items = []) => {
    const rawItems = items.filter((item) => Number(item.quantity) > 0);
    const validItems = [];

    for (const item of rawItems) {
        const product = await ProductModel.findById(item.product);

        // Si el producto no existe o su estado está inactivo, no se agrega al carrito
        if (!product || !product.status || product.stock <= 0) {
            continue;
        }

        // Limitar la cantidad al stock real disponible en inventario
        const allowedQuantity = Math.min(Number(item.quantity), product.stock);

        if (allowedQuantity > 0) {
            validItems.push({
                product: item.product,
                quantity: allowedQuantity
            });
        }
    }

    const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        { items: validItems },
        { new: true, upsert: true, runValidators: true }
    ).populate('items.product');

    return cart;
};

/**
 * Sincroniza y fusiona (Merge) los productos del carrito anónimo (guest)
 * con el carrito del usuario autenticado, aplicando límites de stock.
 */
const dbSyncCart = async (userId, guestItems = []) => {
    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
        cart = new CartModel({ user: userId, items: [] });
    }

    for (const guestItem of guestItems) {
        if (!guestItem.product || !guestItem.quantity) continue;

        const product = await ProductModel.findById(guestItem.product);

        // Si el producto no existe, está inactivo o sin stock, ignorar
        if (!product || !product.status || product.stock <= 0) {
            continue;
        }

        const productIdStr = guestItem.product.toString();
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productIdStr
        );

        if (existingItemIndex > -1) {
            // Si ya existía, sumar la cantidad pero topada al stock máximo disponible
            const newQuantity = cart.items[existingItemIndex].quantity + Number(guestItem.quantity);
            cart.items[existingItemIndex].quantity = Math.min(newQuantity, product.stock);
        } else {
            // Si es nuevo, agregarlo sin superar el stock del producto
            const initialQuantity = Math.min(Number(guestItem.quantity), product.stock);
            if (initialQuantity > 0) {
                cart.items.push({
                    product: guestItem.product,
                    quantity: initialQuantity
                });
            }
        }
    }

    await cart.save();
    return await CartModel.findById(cart._id).populate('items.product');
};

/**
 * Elimina un producto específico del carrito de un usuario por su productId.
 */
const dbRemoveItemFromCart = async (userId, productId) => {
    const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true }
    ).populate('items.product');

    return cart;
};

/**
 * Vacía completamente el carrito de compras de un usuario.
 */
const dbClearCart = async (userId) => {
    const cart = await CartModel.findOneAndUpdate(
        { user: userId },
        { items: [] },
        { new: true }
    ).populate('items.product');

    return cart;
};

export {
    dbGetCartByUserId,
    dbUpdateCart,
    dbSyncCart,
    dbRemoveItemFromCart,
    dbClearCart
};
