import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Storage para imágenes de productos
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/products';
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    }
});

// Filtro para validar formatos permitidos (Solo imágenes)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

    const mime = file.mimetype.toLowerCase();
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(mime) || allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Formato no permitido. Solo se aceptan imágenes (JPG, JPEG, PNG, WEBP).'), false);
    }
};

// Middleware Multer para procesar hasta 9 imágenes de producto (2MB máximo por imagen)
const uploadProductImages = multer({
    storage: productStorage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: fileFilter
}).array('images', 9);

export { uploadProductImages };
