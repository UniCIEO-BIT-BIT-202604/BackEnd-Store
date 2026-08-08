import ProductModel from "../models/Product.model.js";

const dbCreateProduct = async (newProduct) => {
    return await ProductModel.create(newProduct);
}

const dbGetProducts = async () => {
    return await ProductModel.find().populate('category');
}

const dbGetProductById = async (id) => {
    return await ProductModel.findOne({ _id: id }).populate('category');
}

const dbDeleteProduct = async (id) => {
    return await ProductModel.findByIdAndDelete(id);
    return await ProductModel.findOneAndDelete({ _id: id });
}

const dbUpdateProduct = async (id, inputData) => {
    return await ProductModel.findByIdAndUpdate(
        id,                 // Objeto de consulta
        inputData,           // El objeto con las propiedades y los valores que deseamos actualizar
        {
            returnDocument: 'after',                  // Retornar el documento actualizado
            runValidators: true         // Mongoose realiza las validaciones del esquema
        }
    );

    return await ProductModel.findOneAndUpdate(
        { _id: id },                    // Objeto de consulta 
        inputData,                      // El objeto con las propiedades y los valores que deseamos actualizar
        {
            returnDocument: 'after',                  // Retornar el documento actualizado
            runValidators: true         // Mongoose realiza las validaciones del esquema
        }
    );

}


export {
    dbCreateProduct,
    dbGetProducts,
    dbGetProductById,
    dbDeleteProduct,
    dbUpdateProduct
}

