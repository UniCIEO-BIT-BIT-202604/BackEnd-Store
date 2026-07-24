import { Router } from "express";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/category.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";

const categoryRouter = Router();


categoryRouter.get('/',  getCategory);
categoryRouter.post('/', 
    // [authenticationUser, authorizationUser([ ROLES.ADMIN ])],
    createCategory);
categoryRouter.patch('/', authenticationUser, updateCategory);
categoryRouter.delete('/', authenticationUser, deleteCategory);



export default categoryRouter;


