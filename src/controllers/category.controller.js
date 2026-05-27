import { insertCategory } from "../services/category.services.js";


const getCategory = (req, res)=>{
    res.json({
        msg: 'Listar Categorias'
    })
}

const createCategory = async (req, res)=>{
    try {
        const inputData = req.body;

        const data = await deleteCategory(inputData);

        res.status(201).json({
            data : data
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se pudo registar la categoria'
        })
    }
}



const updateCategory = ( req, res ) => {
    res.json({
        msg: 'Actualiza una categoria'
    });
}

const deleteCategory = ( req, res ) => {
    res.json({
        msg: 'Elimina un producto'
    });
}

export {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}
