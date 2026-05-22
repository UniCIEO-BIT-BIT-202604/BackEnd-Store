import ProductModel from "../models/Product.model.js";

const getProducts = ( req, res ) => {
    res.json({
        msg: 'Listar Productos'
    });
}

const createProduct = async ( req, res ) => {
    // Obtengo los datos enviados en la petición
    const inputData = req.body;

    // Registra usando el Modelo y guarda la respuesta en la constante data
    const data = await ProductModel.create( inputData );

    // Respondemos al cliente enviando los datos registrados
    res.json({
        data: data
    });
}

const updateProduct = ( req, res ) => {
    res.json({
        msg: 'Actualiza un producto'
    });
}

const deleteProduct = ( req, res ) => {
    res.json({
        msg: 'Elimina un producto'
    });
}



export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}