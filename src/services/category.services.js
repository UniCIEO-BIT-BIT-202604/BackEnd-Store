import categoryModel from "../models/category.model.js"


const insertCategory = async (newCategory) => {
    return await categoryModel.create(newCategory);
}

const dbGetCategories = async () => {
    return await categoryModel.find();
}

const dbGetCategoryById = async (_id) => {
    return await categoryModel.findOne({ _id });
}

const dbUpdateCategoryById = async (_id, updatedData) => {
    return await categoryModel.findByIdAndUpdate(_id, updatedData, { new: true });
}

const dbDeleteCategoryById = async (_id) => {
    return await categoryModel.findByIdAndDelete(_id);
}

export {
    insertCategory,
    dbGetCategories,
    dbGetCategoryById,
    dbUpdateCategoryById,
    dbDeleteCategoryById
}