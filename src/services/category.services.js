import categoryModel from "../models/category.model.js"


const insertCategory = async (newCategory)=>{
    return await categoryModel.create(newCategory);
}

export {
    insertCategory
}