import ProductModel from "../models/Product.model.js";

const insertProduct = async ( newProduct ) => {
    return await ProductModel.create( newProduct );
}

const dbGetProducts = async () => {
    return await ProductModel.find();
}



export {
    insertProduct,
    dbGetProducts
}

