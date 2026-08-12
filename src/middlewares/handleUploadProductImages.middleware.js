import { uploadProductImages } from "./uploadProductImages.middleware.js";

// Middleware helper para capturar y formatear errores de Multer para imágenes de productos
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

export { handleUploadProductImages };
