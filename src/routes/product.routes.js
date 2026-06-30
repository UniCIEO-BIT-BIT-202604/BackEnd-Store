import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";

const productRouter = Router();

productRouter.get('/',  getProducts);
productRouter.post('/', authenticationUser, createProduct);
productRouter.get( '/:id', getProductById  );
productRouter.patch( '/', authenticationUser, updateProduct );
productRouter.delete( '/', authenticationUser, deleteProduct );


export default productRouter;
