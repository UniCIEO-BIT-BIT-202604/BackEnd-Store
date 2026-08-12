import mongoose from "mongoose";
import { dbDeleteCategory, dbGetCategories, dbGetCategoryById, dbUpdateCategory, insertCategory } from "../services/category.services.js";
import { deleteOldImage } from "../helpers/file-storage.js";

const DEFAULT_CATEGORY_IMAGE = '/uploads/categories/default-category.png';

const generateSlug = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

const getCategory = async (req, res) => {
    try {
        const data = await dbGetCategories();
        res.json({
            msg: 'Listar Categorias',
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener todas las categorias'
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID de categoría inválido' });
        }
        const data = await dbGetCategoryById(id);
        if (!data) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }
        res.json({ msg: 'Categoría obtenida por ID', data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener categoría' });
    }
};

const createCategory = async (req, res) => {
    try {
        const inputData = { ...req.body };
        if (!inputData.slug && inputData.name) {
            inputData.slug = generateSlug(inputData.name);
        }

        // Si se subió un archivo físico de imagen, asignar su ruta
        if (req.file) {
            inputData.urlImage = `/uploads/categories/${req.file.filename}`;
        }

        const data = await insertCategory(inputData);
        res.status(201).json({
            msg: 'Categoría creada exitosamente',
            data
        });
    } catch (error) {
        console.error(error);
        // Si ocurrió un error en BD y se había subido archivo, borrarlo del disco
        if (req.file) {
            await deleteOldImage(`/uploads/categories/${req.file.filename}`);
        }

        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'Error de duplicidad: Ya existe una categoría con ese nombre o slug'
            });
        }
        res.status(500).json({
            msg: 'No se pudo registrar la categoria'
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.file) {
                await deleteOldImage(`/uploads/categories/${req.file.filename}`);
            }
            return res.status(400).json({ msg: 'ID de categoría inválido' });
        }

        const existingCategory = await dbGetCategoryById(id);
        if (!existingCategory) {
            if (req.file) {
                await deleteOldImage(`/uploads/categories/${req.file.filename}`);
            }
            return res.status(404).json({ msg: 'La categoría a actualizar no existe' });
        }

        const inputData = { ...req.body };
        if (inputData.name && !inputData.slug) {
            inputData.slug = generateSlug(inputData.name);
        }

        // CASO 1: El cliente envía una NUEVA imagen física
        if (req.file) {
            // Eliminar imagen previa en disco (si no era la por defecto)
            if (existingCategory.urlImage && !existingCategory.urlImage.includes('default-category.png')) {
                await deleteOldImage(existingCategory.urlImage);
            }
            inputData.urlImage = `/uploads/categories/${req.file.filename}`;
        }
        // CASO 2: El cliente solicita quitar la imagen asignando urlImage como cadena vacía
        else if (req.body.urlImage === '') {
            if (existingCategory.urlImage && !existingCategory.urlImage.includes('default-category.png')) {
                await deleteOldImage(existingCategory.urlImage);
            }
            inputData.urlImage = DEFAULT_CATEGORY_IMAGE;
        }

        const data = await dbUpdateCategory(id, inputData);
        res.json({
            msg: 'Categoría actualizada exitosamente',
            data
        });
    } catch (error) {
        console.error(error);
        if (req.file) {
            await deleteOldImage(`/uploads/categories/${req.file.filename}`);
        }
        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'Error de duplicidad: Ya existe una categoría con ese nombre o slug'
            });
        }
        res.status(500).json({
            msg: 'Error al actualizar la categoría'
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'ID de categoría inválido' });
        }

        const category = await dbGetCategoryById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        // Eliminar imagen física del disco si no es la por defecto
        if (category.urlImage && !category.urlImage.includes('default-category.png')) {
            await deleteOldImage(category.urlImage);
        }

        const data = await dbDeleteCategory(id);
        res.json({
            msg: 'Categoría eliminada exitosamente',
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al eliminar la categoría'
        });
    }
};

export {
    getCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
