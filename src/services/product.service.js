import ProductModel from "../models/Product.model.js";

const insertProduct = async ( newProduct ) => {
    return await ProductModel.create( newProduct );
}

export {
    insertProduct
}

