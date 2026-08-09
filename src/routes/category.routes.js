import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js";
import { handleUploadCategoryImage } from "../middlewares/handleUploadCategoryImage.middleware.js";

const categoryRouter = Router();

categoryRouter.get('/', getCategory);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.post('/', handleUploadCategoryImage, createCategory);
categoryRouter.patch('/:id', handleUploadCategoryImage, updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
