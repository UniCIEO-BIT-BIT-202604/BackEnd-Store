import { uploadAvatar } from "./uploadAvatar.middleware.js";

// Middleware helper para capturar y formatear errores de Multer para avatares (tamaño > 2MB o tipo MIME inválido)
const handleUploadAvatar = (req, res, next) => {
    uploadAvatar.single('avatarUrl')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    msg: 'Error de validación en la imagen',
                    errors: ['El peso de la imagen no puede superar los 2MB']
                });
            }
            return res.status(400).json({
                msg: 'Error de validación en la imagen',
                errors: [err.message]
            });
        }
        next();
    });
};

export { handleUploadAvatar };
