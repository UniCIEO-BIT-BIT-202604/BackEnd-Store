import ProductModel from "../models/product.model.js";

const dbCreateProduct = async (newProduct) => {
    const createdProduct = await ProductModel.create(newProduct);
    return await createdProduct.populate('category');
}

const dbGetProducts = async () => {
    return await ProductModel.find().populate('category');
}

const dbGetProductById = async (id) => {
    return await ProductModel.findOne({ _id: id }).populate('category');
}

const dbDeleteProduct = async (id) => {
    return await ProductModel.findByIdAndDelete(id);
}

const dbUpdateProduct = async (id, inputData) => {
    return await ProductModel.findByIdAndUpdate(
        id,                 // Objeto de consulta
        inputData,           // El objeto con las propiedades y los valores que deseamos actualizar
        {
            returnDocument: 'after',                  // Retornar el documento actualizado
            runValidators: true         // Mongoose realiza las validaciones del esquema
        }
    ).populate('category');
}


export {
    dbCreateProduct,
    dbGetProducts,
    dbGetProductById,
    dbDeleteProduct,
    dbUpdateProduct
}

