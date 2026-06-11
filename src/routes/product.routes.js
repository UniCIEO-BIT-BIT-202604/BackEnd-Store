import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

const productRouter = Router();



productRouter.get('/',  getProducts);
productRouter.post('/', authenticationUser, createProduct);
productRouter.patch( '/', authenticationUser, updateProduct );
productRouter.delete( '/', authenticationUser, deleteProduct );


export default productRouter;