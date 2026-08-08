import mongoose from "mongoose";

import { dbCreateProduct, dbDeleteProduct, dbGetProductById, dbGetProducts, dbUpdateProduct } from "../services/product.service.js";
import { deleteMultipleImages, deleteOldImage } from "../helpers/file-storage.js";

// Controller: Se encarga de manejar las Peticiones y las Respuestas de los Clientes
const createProduct = async (req, res) => {
    try {
        // 1. VALIDACIÓN: Verificar que vengan imágenes en req.files
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                msg: 'Error de validación en los datos del producto',
                errors: { images: 'El producto debe incluir al menos una (1) imagen' }
            });
        }
        // 2. CONSTRUIR ARREGLO DE IMÁGENES: Mapear req.files para MongoDB
        const imageObjects = req.files.map((file, index) => ({
            url: `/uploads/products/${file.filename}`,
            isMain: index === 0 // La primera imagen será la principal por defecto
        }));
        // 3. MEZCLAR CON EL BODY: Agregar el arreglo 'images' al objeto inputData
        const inputData = {
            ...req.body,
            images: imageObjects
        };

        const data = await dbCreateProduct(inputData);

        res.status(201).json({
            msg: 'Crea un nuevo producto',
            data: data
        });
    } catch (error) {
        console.error(error);

        // 4. LIMPIEZA EN CASO DE ERROR: Si falla Mongoose o la BD, borrar los archivos subidos al disco
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
            await deleteMultipleImages(filePaths);
        }

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

        // Validamos errores de validación de Mongoose (Schema Validation)
        if (error.name === 'ValidationError') {
            const errorDetails = {};

            console.log(' error.errors', error.errors);

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: `Error de validacion en propiedades del producto`,
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
        const inputData = { ...req.body };  // Copia del body recibido

        // 1. OBTENER PRODUCTO ACTUAL EN BD
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.files && req.files.length > 0) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
            }
            return res.status(400).json({
                msg: 'No se pudo actualizar el producto, por que el ID es invalido'
            });
        }

        const currentProduct = await dbGetProductById(id);
        if (!currentProduct) {
            if (req.files && req.files.length > 0) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
            }
            return res.status(404).json({ msg: 'No se pudo actualizar el producto, por que no se encuentra registrado' });
        }

        let updatedImages = currentProduct.images.map(img => (typeof img.toObject === 'function' ? img.toObject() : { ...img }));

        // 2. ELIMINAR IMÁGENES (deleteAllImages, deleteImageUrl o deleteImageUrls)
        if (inputData.deleteAllImages === 'true' || inputData.deleteAllImages === true) {
            const allUrls = updatedImages.map(img => img.url);
            await deleteMultipleImages(allUrls);
            updatedImages = [];
            delete inputData.deleteAllImages;
        } else if (inputData.deleteImageUrl) {
            const targetDeleteUrl = inputData.deleteImageUrl.trim();
            await deleteOldImage(targetDeleteUrl);
            updatedImages = updatedImages.filter(img => img.url !== targetDeleteUrl);
            delete inputData.deleteImageUrl;
        } else if (Array.isArray(inputData.deleteImageUrls)) {
            await deleteMultipleImages(inputData.deleteImageUrls);
            const urlsToDelete = new Set(inputData.deleteImageUrls);
            updatedImages = updatedImages.filter(img => !urlsToDelete.has(img.url));
            delete inputData.deleteImageUrls;
        }

        // 3. AÑADIR NUEVAS IMÁGENES SUBIDAS (req.files)
        if (req.files && req.files.length > 0) {
            if (updatedImages.length + req.files.length > 9) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
                return res.status(400).json({
                    msg: 'Error de validación en las imágenes',
                    errors: { images: 'No se pueden asociar más de nueve (9) imágenes a un producto' }
                });
            }

            const newImages = req.files.map(file => ({
                url: `/uploads/products/${file.filename}`,
                isMain: false
            }));

            updatedImages = [...updatedImages, ...newImages];
        }

        // 4. CAMBIAR IMAGEN PRINCIPAL (Si se recibe mainImageUrl en el body)
        if (inputData.mainImageUrl) {
            const targetMainUrl = inputData.mainImageUrl.trim();
            const exists = updatedImages.some(img => img.url === targetMainUrl);
            if (exists) {
                updatedImages = updatedImages.map(img => ({
                    ...img,
                    isMain: img.url === targetMainUrl
                }));
            }
            delete inputData.mainImageUrl;
        }

        // 5. ASEGURAR QUE AL MENOS UNA IMAGEN SEA LA PRINCIPAL (Si existen imágenes)
        if (updatedImages.length > 0) {
            const hasMain = updatedImages.some(img => img.isMain);
            if (!hasMain) {
                updatedImages[0].isMain = true;
            }
        }

        inputData.images = updatedImages;

        // 6. ACTUALIZAR EN BASE DE DATOS
        const data = await dbUpdateProduct(id, inputData);

        res.json({
            msg: 'Actualiza un producto',
            data: data
        });
    } catch (error) {
        console.error(error);

        // LIMPIEZA EN CASO DE ERROR
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
            await deleteMultipleImages(filePaths);
        }

        // Validacion Exception
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

        // Validamos errores de validación de Mongoose (Schema Validation)
        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: `Error de validacion en propiedades del producto`,
                errors: errorDetails
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'No se pudo actualizar el producto, por que el ID es invalido'
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

        // ELIMINACIÓN EN CASCADA: Borrar todas las imágenes físicas del producto en el servidor
        if (data.images && data.images.length > 0) {
            const imagePaths = data.images.map(img => img.url);
            await deleteMultipleImages(imagePaths);
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

