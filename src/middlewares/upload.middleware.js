import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Configuración de almacenamiento (Dónde y cómo se guardan los archivos en disco)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/avatars';
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Generar un nombre único para evitar que dos usuarios sobrescriban archivos con el mismo nombre
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
});

// 2. Filtro para validar formatos permitidos (Solo imágenes)
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

// 3. Creación y exportación de la instancia de multer con las restricciones (Máx 2MB)
const uploadAvatar = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Restricción estricta de tamaño máximo: 2 Megabytes (2MB)
    },
    fileFilter: fileFilter
});

/** */

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
        cb(null, `product-${uniqueSuffix}${ext}`); // Nombre con prefijo product-
    }
});

// Middleware para procesar hasta 9 imágenes de producto
const uploadProductImages = multer({
    storage: productStorage, // Usamos la nueva ruta
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB máximo por imagen
    },
    fileFilter: fileFilter
}).array('images', 9);



export { uploadAvatar, uploadProductImages };