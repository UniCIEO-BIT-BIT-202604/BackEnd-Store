import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import authorizationUser from "../middlewares/authorization.middleware.js";
import { ROLES } from "../config/global.config.js";
import { handleUploadCategoryImage } from "../middlewares/handleUploadCategoryImage.middleware.js";

const categoryRouter = Router();

// Consultas públicas (GET)
categoryRouter.get('/', getCategory);
categoryRouter.get('/:id', getCategoryById);

// Operaciones protegidas (POST, PATCH, DELETE) para SUPER_ADMIN, ADMIN y EDITOR
categoryRouter.post(
    '/',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR]), handleUploadCategoryImage],
    createCategory
);

categoryRouter.patch(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR]), handleUploadCategoryImage],
    updateCategory
);

categoryRouter.delete(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.SUPER_ADMIN, ROLES.ADMIN]), deleteCategory]
);

export default categoryRouter;
