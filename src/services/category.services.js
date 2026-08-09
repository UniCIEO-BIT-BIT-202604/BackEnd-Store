import categoryModel from "../models/category.model.js";

const insertCategory = async (newCategory) => {
    return await categoryModel.create(newCategory);
};

const dbGetCategories = async () => {
    return await categoryModel.find();
};

const dbGetCategoryById = async (id) => {
    return await categoryModel.findById(id);
};

const dbUpdateCategory = async (id, inputData) => {
    return await categoryModel.findByIdAndUpdate(
        id,
        inputData,
        {
            returnDocument: 'after',
            runValidators: true
        }
    );
};

const dbDeleteCategory = async (id) => {
    return await categoryModel.findByIdAndDelete(id);
};

const dbGetDefaultCategory = async () => {
    try {
        let category = await categoryModel.findOne({
            $or: [{ slug: 'sin-categoria' }, { name: 'Sin Categoría' }]
        });

        if (!category) {
            category = await categoryModel.create({
                name: 'Sin Categoría',
                slug: 'sin-categoria',
                description: 'Categoría asignada automáticamente a productos no categorizados',
                status: true
            });
            console.log('Categoría por defecto "Sin Categoría" (slug: sin-categoria) creada automáticamente');
        }
        return category;
    } catch (error) {
        console.error('Error al obtener/crear la categoría por defecto:', error);
        return null;
    }
};

export {
    insertCategory,
    dbGetCategories,
    dbGetCategoryById,
    dbUpdateCategory,
    dbDeleteCategory,
    dbGetDefaultCategory
};