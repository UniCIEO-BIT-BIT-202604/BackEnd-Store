const getProducts = ( req, res ) => {
    res.json({
        msg: 'Listar Productos'
    });
}

const createProduct = ( req, res ) => {
    res.json({
        msg: 'Crea un producto'
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