import { uploadAvatar, uploadProductImages } from "./upload.middleware.js";

const handleUploadProductImages = (req, res, next) => {
    uploadProductImages(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    msg: 'Error de validación en las imágenes',
                    errors: ['Ninguna imagen individual puede superar los 2MB']
                });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    msg: 'Error de validación en las imágenes',
                    errors: ['No se pueden subir más de 9 imágenes por producto']
                });
            }
            return res.status(400).json({
                msg: 'Error de validación en las imágenes',
                errors: [err.message]
            });
        }
        next();
    });
};

// Middleware helper para capturar y formatear errores de Multer (tamaño > 2MB o tipo MIME inválido)
const handleUploadAvatar = (req, res, next) => {
    uploadAvatar.single('avatarUrl')(req, res, (err) => {
        if (err) {
            // Manejar error de límite de peso (2MB)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    msg: 'Error de validación en la imagen',
                    errors: ['El peso de la imagen no puede superar los 2MB']
                });
            }
            // Manejar error de formato MIME no permitido
            return res.status(400).json({
                msg: 'Error de validación en la imagen',
                errors: [err.message]
            });
        }
        next();
    });
};


export { handleUploadProductImages, handleUploadAvatar };