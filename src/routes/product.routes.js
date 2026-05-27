import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

const productRouter = Router();



productRouter.get('/', getProducts);
productRouter.post('/', createProduct);
productRouter.patch( '/', updateProduct );
productRouter.delete( '/:id', deleteProduct );


export default productRouter;