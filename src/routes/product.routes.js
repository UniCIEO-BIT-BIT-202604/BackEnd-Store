import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller.js';

const router = Router();

// Define las rutas para la entidad 'Product'
router.get( '/', getProducts );
router.post( '/', createProduct );
router.patch( '/', updateProduct );
router.delete( '/', deleteProduct );


export default router;