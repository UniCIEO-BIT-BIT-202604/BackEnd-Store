import mongoose from "mongoose";

import { dbCreateProduct, dbDeleteProduct, dbGetProductById, dbGetProducts, dbUpdateProduct } from "../services/product.service.js";

// Controller: Se encarga de manejar las Peticiones y las Respuestas de los Clientes
const createProduct = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateProduct(inputData);

        res.status(201).json({
            msg: 'Crea un nuevo producto',
            data: data
        });
    } catch (error) {
        console.error(error);

        // Validamos si la propiedad tiene un valor unico
        if (error.code === 11000) {
            const errorDetails = {};

            Object.entries(error.keyValue).forEach(([field, value]) => {
                errorDetails[field] = `La propiedad ${field} con el valor ${value} ya se encuentra registrada.`;
            });

            return res.status(400).json({
                msg: `Error de validacion por duplicidad en propiedades unicas`,
                errors: errorDetails
            });
        }

        res.status(500).json({
            msg: 'Error: No se pudo crear el producto'
        });
    }
}

const getProducts = async (req, res) => {
    try {
        const data = await dbGetProducts();

        res.json({
            msg: 'Obtener todos los productos',
            data: data
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'ERROR: No pudo obtener los productos'
        });
    }
}

const getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        // Validacion Defensiva: Condicionamos previo a que ocurra el error (Nunca ocurre)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'No se puede obtener producto por que el ID proporcionado es invalido'
            });
        }

        const data = await dbGetProductById(id);
        // Validacion Directa al resultado de la consulta
        if (!data) {
            return res.json({
                msg: 'No se puede obtener un producto que no se encuentra registrado'
            });
        }

        res.json({
            msg: 'Obtiene un producto por ID',
            data: data
        });
    } catch (error) {
        console.error(error);

        //

        res.status(500).json({
            msg: 'Error: No pudo obtener producto por ID'
        });
    }

}

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;           // Id de la ruta para encontrar el documento que quiero actualizar
        const inputData = req.body;         // Obteniendo el objeto con el/los parametro/s que quiero actualizar

        const data = await dbUpdateProduct(id, inputData);
        // Creo una Exception "falsa"
        if (!data) {
            // Induce un Error (Crea una Exception)
            throw new Error('No se pudo actualizar el producto, por que no se encuentra registrado');
        }

        res.json({
            msg: 'Actualiza un producto',
            data: data
        });
    } catch (error) {
        console.error(error);

        // Validacion Exception: Manejar cuando ocurre el error
        if (error.code === 11000) {
            const errorDetails = {};

            Object.entries(error.keyValue).forEach(([field, value]) => {
                errorDetails[field] = `El campo '${field}' con el valor '${value}' ya se encuentra registrado.`;
            });

            return res.status(400).json({
                msg: `Error de validacion por duplicidad en propiedades unicas`,
                errors: errorDetails
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'No se pudo actualizar el producto, por que el ID es invalido'
            });
        }

        if (error.message.includes('No se pudo actualizar el producto, por que no se encuentra registrado')) {
            return res.json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'Error: No pudo actualizar el producto por su ID'
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        // Validacion Defensiva: Condicionamos previo a que ocurra el error (Nunca ocurre)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'No se puede eliminar, por que el ID proporcionado es invalido'
            });
        }

        const data = await dbDeleteProduct(id);
        // Validacion Directa al resultado de la consulta
        if (!data) {
            return res.json({
                msg: 'No se puede eliminar un producto que no se encuentra registrado'
            });
        }

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
    getProductById,
    updateProduct,
    deleteProduct
};