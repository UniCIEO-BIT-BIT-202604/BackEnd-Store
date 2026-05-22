import { insertProduct } from "../services/product.service.js";

const getProducts = ( req, res ) => {
    res.json({
        msg: 'Listar Productos'
    });
}

const createProduct = async ( req, res ) => {
    try {
        // Obtengo los datos enviados en la petición
        const inputData = req.body;

        // Registra usando el Modelo y guarda la respuesta en la constante data
        const data = await insertProduct( inputData );

        // Respondemos al cliente enviando los datos registrados. El codigo de estado cuando se crea un recurso nuevo con exito
        res.status(201).json({
            data: data
        });
    } catch (error) {
        console.error( error );         // Mensaje para la consola (Desarrollador)

        // Respondemos al cliente enviando un mensaje humano. El codigo de estado cuando el servidor falla
        res.status(500).json({
            msg: 'No se pudo registrar el producto'
        })
    }
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