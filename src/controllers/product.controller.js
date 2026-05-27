import { dbCreateProduct, dbDeleteProduct, dbGetProducts } from "../services/product.service.js";

// Controller: Se encarga de manejar las Peticiones y las Respuestas de los Clientes
const createProduct = async ( req, res ) => {
    try {
        const inputData = req.body;

        const data = await dbCreateProduct( inputData );

        res.status( 201 ).json({
            msg: 'Crea un nuevo producto',
            data: data
        });
    } catch (error) {
        console.error( error );

        res.status(500).json({
            msg: 'Error: No se pudo crear el producto'
        });
    }
}

const getProducts = async ( req, res ) => {
    try {
        const data = await dbGetProducts();

        res.json({
            msg: 'Obtener todos los productos',
            data: data
        });
    } catch (error) {
        console.error( error );

        res.status(500).json({
            msg: 'ERROR: No pudo obtener los productos'
        });
    }
}

const updateProduct = ( req, res ) => {
    res.json({
        msg: 'Actualiza un producto'
    });
}

const deleteProduct = async ( req, res ) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteProduct( id );

        res.json({
            msg: 'Elimina un producto',
            data: data
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'ERROR: No pudo eliminar el producto'
        });
    }
}


export {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
};