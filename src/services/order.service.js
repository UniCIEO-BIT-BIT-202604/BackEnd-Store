import OrderModel from '../models/order.model.js';
import ProductModel from '../models/product.model.js';
import CartModel from '../models/cart.model.js';

/**
 * Crea una nueva orden de compra, realizando:
 * 1. Verificación de stock disponible por cada producto.
 * 2. Congelamiento de información histórica (nombre, precio, cantidad).
 * 3. Descuento de stock en ProductModel ($inc: -quantity).
 * 4. Creación del registro en OrderModel.
 * 5. Vaciamiento automático del carrito del usuario en CartModel.
 */
const dbCreateOrder = async (userId, orderPayload) => {

    // Destructuring de la petición
    const { shippingAddress, paymentMethod, items: directItems } = orderPayload;

    let itemsToProcess = [];

    // Si la petición trae un arreglo de ítems directos, usarlos; de lo contrario, obtenerlos del carrito en DB
    if (Array.isArray(directItems) && directItems.length > 0) {
        itemsToProcess = directItems;
    } else {

        // Obtener el carrito del usuario autenticado
        const userCart = await CartModel.findOne({ user: userId }).populate('items.product');

        // Valida si el carrito existe y tiene productos
        if (!userCart || !userCart.items || userCart.items.length === 0) {
            throw new Error('El carrito de compras está vacío');
        }

        // Mapear los items del carrito a itemsToProcess
        itemsToProcess = userCart.items.map(item => ({
            product: item.product._id || item.product,
            quantity: item.quantity
        }));
    }

    // Preparar los items de la orden, calcular el monto total y preparar los productos para actualizar el stock
    const orderItems = [];
    let calculatedTotalAmount = 0;
    const productsToUpdate = [];

    // 1. Validar existencia y stock suficiente de todos los productos
    for (const item of itemsToProcess) {
        const productId = item.product._id || item.product;
        const requestedQty = Number(item.quantity);

        // Validar que el producto existe y la cantidad es mayor a 0
        if (!productId || requestedQty <= 0) continue;

        // Obtener el producto
        const product = await ProductModel.findById(productId);

        // Validar que el producto existe y está activo
        if (!product || !product.status) {
            throw new Error(`El producto no está disponible en la tienda`);
        }

        // Validar stock suficiente
        if (product.stock < requestedQty) {
            throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${requestedQty}`);
        }

        // Calcular subtotal y agregar al total
        const itemSubtotal = product.price * requestedQty;
        calculatedTotalAmount += itemSubtotal;

        // Agregar item al arreglo de items de la orden (con información congelada del producto)
        orderItems.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: requestedQty
        });

        // Agregar productos a actualizar stock
        productsToUpdate.push({
            productId: product._id,
            quantityToDeduct: requestedQty
        });
    }

    // Validar que hay productos válidos para procesar la orden
    if (orderItems.length === 0) {
        throw new Error('No se encontraron productos válidos para procesar la orden');
    }

    // 2. Descontar stock en la colección ProductModel
    for (const prod of productsToUpdate) {

        // Actualiza el stock del producto en ProductModel
        await ProductModel.findByIdAndUpdate(
            prod.productId,
            { $inc: { stock: -prod.quantityToDeduct } }
        );
    }

    // 3. Crear el documento de la Orden
    const newOrder = await OrderModel.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        totalAmount: calculatedTotalAmount,
        paymentMethod: paymentMethod || 'MOCK_CARD',
        status: 'PAID'
    });

    // 4. Vaciar el carrito de compras en la base de datos
    await CartModel.findOneAndUpdate(
        { user: userId },
        { items: [] }
    );

    return await OrderModel.findById(newOrder._id)
        .populate('user', '-password')
        .populate('items.product');
};

/**
 * Obtiene el historial de órdenes de un usuario ordenadas por fecha reciente, poblando usuario y producto.
 */
const dbGetOrdersByUserId = async (userId) => {
    return await OrderModel.find({ user: userId })
        .populate('user', '-password')
        .populate('items.product')
        .sort({ createdAt: -1 });
};

/**
 * Obtiene el detalle de una orden por su ID poblando usuario y producto.
 */
const dbGetOrderById = async (orderId, userId) => {
    return await OrderModel.findOne({ _id: orderId, user: userId })
        .populate('user', '-password')
        .populate('items.product');
};

export {
    dbCreateOrder,
    dbGetOrdersByUserId,
    dbGetOrderById
};
