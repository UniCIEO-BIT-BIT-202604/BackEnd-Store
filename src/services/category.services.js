import categoryModel from "../models/category.model.js"


const insertCategory = async (newCategory)=>{
    return await categoryModel.create(newCategory);
}

const dbGetCategories = async () => {
    return await categoryModel.find();
}

export {
    insertCategory,
    dbGetCategories
}