import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import authorizationUser from "../middlewares/authorization.middleware.js";
import { ROLES } from "../config/global.config.js";
import { handleUploadProductImages } from "../middlewares/handleUploadProductImages.middleware.js";

const productRouter = Router();

// Consultas públicas (GET)
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);

// Operaciones protegidas (POST, PATCH, DELETE) para SUPER_ADMIN, ADMIN y EDITOR
productRouter.post(
    '/',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR]), handleUploadProductImages],
    createProduct
);

productRouter.patch(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR]), handleUploadProductImages],
    updateProduct
);

productRouter.delete(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN]), deleteProduct]
);

export default productRouter;
