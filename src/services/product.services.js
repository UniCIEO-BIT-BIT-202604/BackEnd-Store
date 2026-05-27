import ProductModel from "../models/product.model.js";



const dbCreateProducts =   async (newProduct)=>{
    return await  ProductModel.create(newProduct);
};


const dbGetProducts = async () =>{
    return await ProductModel.find();
}
export  {dbCreateProducts , dbGetProducts}