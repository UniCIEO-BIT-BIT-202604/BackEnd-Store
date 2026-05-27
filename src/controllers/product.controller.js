
import { dbCreateProducts, dbGetProducts,  } from "../services/product.services.js";

 
const getProducts =  async ( req, res ) => {
  try {
     const data = await dbGetProducts();
       res.json({
        msg: 'Listar Productos',

        data : data,
    });
  
        res.status(201).json({
            data : data
        });

  } catch (error) {
    console.log(error); 

        res.status(500).json({
            msg: 'No se  pudo registrar el  listado de producto'
        })
    
  }
}


const createProduct = async (req, res) =>{
    try {
        const inputData = req.body;

        const data = await dbCreateProducts(inputData);

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
       
    const id  = req.params.id
    res.json({
        msg: 'Elimina un producto',
        id: id
    });
}



export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}