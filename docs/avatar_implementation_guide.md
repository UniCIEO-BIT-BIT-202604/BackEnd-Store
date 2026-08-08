# Guía de Implementación: Gestión de Avatares de Usuario en el BackEnd

Esta guía paso a paso describe la arquitectura y los pasos técnicos necesarios para implementar la carga, actualización, eliminación y asignación de imágenes de avatar por defecto en el modelo `User` y en el CRUD de usuarios.

---

## 1. Configuración de Almacenamiento Estático y Carga de Archivos (`multer`)

Para procesar imágenes transmitidas en peticiones `multipart/form-data`:

1. **Instalar Middleware de Subida de Archivos**:
   - Agregar `multer` a las dependencias del proyecto:
     ```bash
     npm i multer
     ```
2. **Crear Directorio de Archivos Estáticos**:
   - Crear la estructura de carpetas en el servidor para almacenar imágenes (ej. `public/uploads/avatars/`).
3. **Servir Archivos Estáticos en Express (`src/index.js`)**:
   - Configurar Express para servir la carpeta pública mediante un middleware estático:
     ```javascript
     app.use('/uploads', express.static('public/uploads'));
     ```

---

## 2. Ubicación de la Configuración de `multer` (`uploadAvatar.middleware.js` y `handleUploadAvatar.middleware.js`)

La mejor práctica en arquitecturas modulares es separar los middlewares de carga por entidad:
* `src/middlewares/uploadAvatar.middleware.js`
* `src/middlewares/handleUploadAvatar.middleware.js`

### 📄 Archivo a Crear/Configurar: `src/middlewares/uploadAvatar.middleware.js`

```javascript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Configuración de almacenamiento (Dónde y cómo se guardan los archivos en disco)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Carpeta donde se guardarán físicamente los avatares (se crea automáticamente si no existe)
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

// 3. Creación y exportación del middleware de multer con restricción de 2MB
const uploadAvatar = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Restricción estricta de tamaño máximo: 2 Megabytes (2MB)
    },
    fileFilter: fileFilter
});

export { uploadAvatar, fileFilter };
```

---

### 📄 Manejo de Errores: `src/middlewares/handleUploadAvatar.middleware.js`

```javascript
import { uploadAvatar } from "./uploadAvatar.middleware.js";

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
```

---

### 📄 Importación en las Rutas (`src/routes/user.routes.js`)

```javascript
import { Router } from 'express';
import { uploadAvatar } from '../middlewares/uploadAvatar.middleware.js';
import { handleUploadAvatar } from '../middlewares/handleUploadAvatar.middleware.js';
```
import { createUser, updateUser, getUsers, getUserById, deleteUser } from '../controllers/user.controller.js';

const router = Router();

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

router.get('/', getUsers);
router.post('/', handleUploadAvatar, createUser);
router.get('/:id', getUserById);
router.patch('/:id', handleUploadAvatar, updateUser);
router.delete('/:id', deleteUser);

export default router;
```

---

## 3. Ajustes en el Modelo de Usuario (`src/models/user.model.js`)

1. **Actualizar el Campo `avatarUrl` en `UserSchema`**:
   - Usar la propiedad `avatarUrl` con el valor por defecto que apunte a la imagen estática:
     ```javascript
     avatarUrl: {
         type: String,
         default: '/uploads/avatars/default-avatar.png'
     }
     ```

---

## 4. Helper para la Eliminación del Sistema de Archivos (`src/helpers/file-storage.js`)

Crear un módulo helper para manejar la eliminación segura de archivos locales del servidor:

```javascript
import fs from 'fs';
import path from 'path';

const deleteOldImage = async (imagePath) => {
    // Si no hay ruta o es la imagen por defecto, no eliminar nada
    if (!imagePath || imagePath.includes('default-avatar.png')) {
        return;
    }

    try {
        const fullPath = path.join(process.cwd(), 'public', imagePath);
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
    } catch (error) {
        console.error('Error al eliminar la imagen previa:', error);
    }
};

export default deleteOldImage;
```

---

## 5. Integración en los Controladores de Usuarios (`src/controllers/user.controller.js`)

Lógica completa para manejar la subida, actualización (con borrado previo o reasignación a la por defecto) y eliminación de avatares:

```javascript
import UserModel from '../models/user.model.js';
import deleteOldImage from '../helpers/file-storage.js';

// A. CREAR USUARIO
export const createUser = async (req, res) => {
    try {
        const inputData = { ...req.body };

        // Si se subió un archivo, asignar su ruta a avatarUrl
        if (req.file) {
            inputData.avatarUrl = `/uploads/avatars/${req.file.filename}`;
        }
        // Si no se envía archivo, Mongoose aplicará automáticamente la imagen por defecto (/uploads/avatars/default-avatar.png)

        const data = await dbCreateUser(inputData);
        res.status(201).json({ msg: 'Usuario creado exitosamente', data });

    } catch (error) {
        // En caso de fallo en BD, limpiar la foto que recién subió Multer
        if (req.file) {
            await deleteOldImage(`/uploads/avatars/${req.file.filename}`);
        }
        // Retornar mensajes de error...
    }
};

// B. ACTUALIZAR USUARIO (Manejo de Reemplazo o Restablecimiento a Imagen por Defecto)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const inputData = { ...req.body };

        // 1. Buscar el usuario actual en la BD
        const existingUser = await dbGetUserByIdRaw(id);
        if (!existingUser) {
            throw new Error('El usuario que deseas actualizar no existe en el sistema');
        }

        // CASO 1: El cliente envía una NUEVA imagen en req.file
        if (req.file) {
            // Eliminar la imagen previa física del servidor (si no era la por defecto)
            await deleteOldImage(existingUser.avatarUrl);

            // Asignar la nueva ruta al payload de actualización
            inputData.avatarUrl = `/uploads/avatars/${req.file.filename}`;

        // CASO 2: El cliente solicita quitar/eliminar el avatar enviando avatarUrl como cadena vacía ("")
        } else if (req.body.avatarUrl === '') {
            // Eliminar la imagen previa física del servidor (si no era la por defecto)
            await deleteOldImage(existingUser.avatarUrl);

            // Reasignar la ruta a la imagen por defecto
            inputData.avatarUrl = '/uploads/avatars/default-avatar.png';
        }

        // 2. Actualizar en la BD
        const data = await dbUpdateUser(id, inputData);
        res.json({ data });

    } catch (error) {
        // Si falló la actualización en BD y Multer había subido una foto nueva, eliminarla
        if (req.file) {
            await deleteOldImage(`/uploads/avatars/${req.file.filename}`);
        }
        // Manejar respuesta de errores...
    }
};

// C. ELIMINAR USUARIO
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await dbGetUserByIdRaw(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Eliminar la imagen física del avatar (si no es la por defecto)
        await deleteOldImage(user.avatarUrl);

        // Eliminar el usuario de la BD
        const data = await dbDeleteUser(id);
        res.json({ msg: 'Usuario eliminado exitosamente', data });

    } catch (error) {
        // Manejar respuesta de errores...
    }
};
```

---

## 6. Resumen de Manejo de Errores e Edge Cases

1. **Mensaje de Error de Validación de Archivos**:
   - `handleUploadAvatar` captura los errores de Multer devolviendo un estado HTTP `400 Bad Request` con un formato JSON unificado:
     ```json
     {
       "msg": "Error de validación en la imagen",
       "errors": ["El peso de la imagen no puede superar los 2MB"]
     }
     ```
2. **Eliminación y Reemplazo de Avatar**:
   - Al actualizar con una nueva foto (`req.file`), `deleteOldImage(existingUser.avatarUrl)` elimina el archivo anterior del disco.
   - Si se desea remover la foto personalizada sin subir una nueva (enviando `avatarUrl: ""`), el controlador elimina la foto previa y asigna nuevamente `/uploads/avatars/default-avatar.png`.

---

## 🧪 Guía de Pruebas Paso a Paso en Bruno / Postman

Para ver en detalle los ejemplos de peticiones HTTP, formularios `multipart/form-data`, payloads JSON y respuestas esperadas, consulta la guía de pruebas:
👉 **[Guía de Pruebas: Gestión de Avatares en Bruno / Postman](file:///home/jcarlosj/Projects/E-commerce/docs/backend/guia_pruebas_avatar.md)**

