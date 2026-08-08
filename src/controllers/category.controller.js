import { dbGetCategories, dbGetCategoryById, insertCategory, dbUpdateCategoryById, dbDeleteCategoryById } from "../services/category.services.js";

const getCategory = async (req, res)=>{
    try {
        const data = await dbGetCategories();

        res.json({
            msg: 'Listar Categorias',
            data
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al obtener todas las categorias'
        })
    }
}

const createCategory = async (req, res)=>{
    try {
        const inputData = req.body;
        // const { _id } = req.payload;
    
        // inputData.createdBy = _id;       // Asignando automaticamente el id del usuario que se encuentra logueado

        const data = await insertCategory(inputData);

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

const updateCategory = async ( req, res ) => {
    try {
        const id = req.params.id;
        const updatedCategory = req.body;

        const data = await dbUpdateCategoryById( id, updatedCategory );
        if( !data ) {
            return res.status( 404 ).json({
                msg: 'No se encontro la categoria para actualizar'
            });
        }

        res.json({
            msg: 'Categoria actualizada exitosamente',
            data
        });
    } catch (error) {
        console.error( error );
        res.status( 500 ).json({
            msg: 'Error al actualizar la categoria'
        });
    }
}

const deleteCategory = async ( req, res ) => {
    try {
        const id = req.params.id;

        const data = await dbDeleteCategoryById( id );
        if( !data ) {
            return res.status( 404 ).json({
                msg: 'No se encontro la categoria para eliminar'
            });
        }

        res.json({
            msg: 'Categoria eliminada exitosamente',
            data
        });
    } catch (error) {
        console.error( error );
        res.status( 500 ).json({
            msg: 'Error al eliminar la categoria'
        });
    }
}


const getCategoryById =  async ( req, res ) => {
    try {
        const id = req.params.id;

        const data = await dbGetCategoryById( id );
        if( !data ) {
            res.status( 401 ).json({
                msg: 'No se ha encontrado la categoria por el ID ' + id 
            });
        }

        res.json({
            msg: 'Se encontro la categoria',
            data
        });

    } catch (error) {
        console.error( error );
        res.status( 500 ).json({
            msg: 'No se ha podido obtener la categoria por ID'
        });
    }
}

export {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
}
