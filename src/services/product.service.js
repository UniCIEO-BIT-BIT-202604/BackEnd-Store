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



export {
    dbCreateProduct,
    dbGetProducts,
    dbDeleteProduct
}

