import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import { handleUploadProductImages } from "../middlewares/handleUpload.middleware.js";

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', handleUploadProductImages, createProduct);
productRouter.get('/:id', getProductById);
productRouter.patch('/:id', handleUploadProductImages, updateProduct);
productRouter.delete('/:id', deleteProduct);


export default productRouter;
