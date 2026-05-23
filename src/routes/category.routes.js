import { Router } from "express";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();


categoryRouter.get('/', getCategory);
categoryRouter.post('/', createCategory);
categoryRouter.patch('/', updateCategory);
categoryRouter.delete('/', deleteCategory);



export default categoryRouter;


