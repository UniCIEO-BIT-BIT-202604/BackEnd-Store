import ProductModel from "../models/product.model.js";



const insertProducts =   async (newProduct)=>{
    return await  ProductModel.create(newProduct);
};

export  {insertProducts}