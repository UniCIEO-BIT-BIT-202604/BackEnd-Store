import { insertProducts } from "../services/product.services.js";

 
const getProducts = ( req, res ) => {
    res.json({
        msg: 'Listar Productos'
    });
}


const createProduct = async (req, res) =>{
    try {
        const inputData = req.body;

        const data = await insertProducts(inputData);

        res.status(201).json({
            data : data
        });
        
    } catch (error) {
        console.log(error); 

        res.status(500).json({
            msg: 'No se  pudo registrar el producto'
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