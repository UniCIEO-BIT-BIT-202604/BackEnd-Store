import multer from 'multer';
import path from 'path';

// 1. Configuración de almacenamiento (Dónde y cómo se guardan los archivos en disco)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Carpeta donde se guardarán físicamente los avatares
        cb(null, 'public/uploads/avatars');
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
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato no permitido. Solo se aceptan imágenes (JPEG, PNG, WEBP).'), false);
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


export default uploadAvatar;