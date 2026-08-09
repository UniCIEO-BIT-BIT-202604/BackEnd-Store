import mongoose from "mongoose";
import { dbDeleteCategory, dbGetCategories, dbGetCategoryById, dbUpdateCategory, insertCategory } from "../services/category.services.js";

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

        const data = await insertCategory(inputData);
        res.status(201).json({
            msg: 'Categoría creada exitosamente',
            data
        });
    } catch (error) {
        console.error(error);
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
            return res.status(400).json({ msg: 'ID de categoría inválido' });
        }

        const inputData = { ...req.body };
        if (inputData.name && !inputData.slug) {
            inputData.slug = generateSlug(inputData.name);
        }

        const data = await dbUpdateCategory(id, inputData);
        if (!data) {
            return res.status(404).json({ msg: 'La categoría a actualizar no existe' });
        }

        res.json({
            msg: 'Categoría actualizada exitosamente',
            data
        });
    } catch (error) {
        console.error(error);
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

        const data = await dbDeleteCategory(id);
        if (!data) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

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
