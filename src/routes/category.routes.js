import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";

const categoryRouter = Router();

categoryRouter.get('/', getCategory);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.post('/', createCategory);
categoryRouter.patch('/:id', updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
