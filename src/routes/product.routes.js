import { Router } from 'express';

const router = Router();

import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';


// Define rutas para productos
router.get( '/', getProducts );
router.post( '/', createProduct );
router.patch( '/', updateProduct );
router.delete( '/', deleteProduct );


export default router;