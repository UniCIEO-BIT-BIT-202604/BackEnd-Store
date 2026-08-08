import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js";

import authenticationUser from "../middlewares/authentication.middleware.js";
import authorizationUser from "../middlewares/authorization.middleware.js";

import { ROLES } from "../config/global.config.js";


const categoryRouter = Router();


categoryRouter.get(
    '/',
    [authenticationUser, authorizationUser([ROLES.ADMIN])],
    getCategory
);
categoryRouter.post(
    '/',
    [authenticationUser, authorizationUser([ROLES.ADMIN])],
    createCategory
);
categoryRouter.get(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.ADMIN])],
    getCategoryById
);
categoryRouter.patch(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.ADMIN])],
    updateCategory
);
categoryRouter.delete(
    '/:id',
    [authenticationUser, authorizationUser([ROLES.ADMIN])],
    deleteCategory
);




export default categoryRouter;


