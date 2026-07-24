import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";

const productRouter = Router();

productRouter.get('/',  getProducts);
productRouter.post('/', createProduct);
productRouter.get( '/:id', getProductById  );
productRouter.patch( '/', updateProduct );
productRouter.delete( '/', deleteProduct );


export default productRouter;
