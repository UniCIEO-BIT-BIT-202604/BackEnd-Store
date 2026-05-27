import ProductModel from "../models/Product.model.js";

const dbCreateProduct = async ( newProduct ) => {
    return await ProductModel.create( newProduct );
}

const dbGetProducts = async () => {
    return await ProductModel.find();
}

const dbDeleteProduct = async ( id ) => {
    return await ProductModel.findByIdAndDelete( id );
    return await ProductModel.findOneAndDelete({ _id: id });
}

const dbUpdateProduct = async ( id, inputData ) => {
    return await ProductModel.findByIdAndUpdate( 
        id,                 // Objeto de consulta
        inputData,           // El objeto con las propiedades y los valores que deseamos actualizar
        { new: true }       // Configurar la respuesta
    );
    
    return await ProductModel.findOneAndUpdate(
        { _id: id },        // Objeto de consulta 
        inputData,          // El objeto con las propiedades y los valores que deseamos actualizar
        { new: true }       // Configurar la respuesta
    );

}



export {
    dbCreateProduct,
    dbGetProducts,
    dbDeleteProduct,
    dbUpdateProduct
}

