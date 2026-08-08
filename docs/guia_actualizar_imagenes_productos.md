# Guía de Implementación: Actualización de Imágenes en Productos

Esta guía paso a paso describe la arquitectura y el código necesario para implementar la **actualización de imágenes** en la entidad `Product` dentro del BackEnd (Express + Mongoose + Multer).

---

## 1. Reglas de Negocio para la Actualización

1. **Límite Máximo de 9 Imágenes**: Un producto no puede asociar más de 9 imágenes en total (`existentes + nuevas <= 9`).
2. **Subida de Nuevas Imágenes**: Se pueden adjuntar nuevos archivos binarios (`req.files`) mediante `multipart/form-data`.
3. **Selección de Imagen Principal**: Si se envía `mainImageUrl`, dicha imagen quedará marcada con `isMain: true` y las demás con `isMain: false`.
4. **Conservación de la Imagen Principal**: Si el producto conserva imágenes tras la actualización, se debe garantizar que al menos una tenga `isMain: true`.
5. **Limpieza en Caso de Error**: Si la petición falla (por ejemplo, si supera las 9 imágenes o falla Mongoose), los archivos físicos recién subidos en `req.files` deben ser eliminados inmediatamente del servidor.

---

## 2. Ajuste en el Modelo de Datos (`src/models/product.model.js`)

Para permitir que un producto pueda actualizarse manteniendo entre 0 y 9 imágenes, configuramos las reglas de validación en el Schema de Mongoose:

```javascript
images: {
    type: [{
        url: {
            type: String,
            required: [true, 'La URL de la imagen es obligatoria']
        },
        isMain: {
            type: Boolean,
            default: false
        }
    }],
    validate: [
        {
            validator: function (val) {
                // Permitir un arreglo de 0 a 9 imágenes
                return Array.isArray(val) && val.length <= 9;
            },
            message: 'No se pueden asociar más de nueve (9) imágenes a un producto'
        }
    ]
}
```

---

## 3. Controlador de Actualización (`src/controllers/product.controller.js`)

### Implementación del Método `updateProduct`

```javascript
import mongoose from "mongoose";
import { dbGetProductById, dbUpdateProduct } from "../services/product.service.js";
import { deleteMultipleImages, deleteOldImage } from "../helpers/file-storage.js";

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = { ...req.body };

        // 1. Validar ID de Mongo
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.files && req.files.length > 0) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
            }
            return res.status(400).json({
                msg: 'No se pudo actualizar el producto, porque el ID es inválido'
            });
        }

        // 2. Obtener producto existente en la BD
        const currentProduct = await dbGetProductById(id);
        if (!currentProduct) {
            if (req.files && req.files.length > 0) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
            }
            return res.status(404).json({
                msg: 'No se pudo actualizar el producto, porque no se encuentra registrado'
            });
        }

        let updatedImages = currentProduct.images.map(img => (typeof img.toObject === 'function' ? img.toObject() : { ...img }));

        // 3. Eliminar imágenes específicas si se solicitaron en la petición
        if (inputData.deleteAllImages === 'true' || inputData.deleteAllImages === true) {
            const allUrls = updatedImages.map(img => img.url);
            await deleteMultipleImages(allUrls);
            updatedImages = [];
            delete inputData.deleteAllImages;
        } else if (inputData.deleteImageUrl) {
            const targetDeleteUrl = inputData.deleteImageUrl.trim();
            await deleteOldImage(targetDeleteUrl);
            updatedImages = updatedImages.filter(img => img.url !== targetDeleteUrl);
            delete inputData.deleteImageUrl;
        } else if (Array.isArray(inputData.deleteImageUrls)) {
            await deleteMultipleImages(inputData.deleteImageUrls);
            const urlsToDelete = new Set(inputData.deleteImageUrls);
            updatedImages = updatedImages.filter(img => !urlsToDelete.has(img.url));
            delete inputData.deleteImageUrls;
        }

        // 4. Procesar y agregar nuevas imágenes subidas (req.files)
        if (req.files && req.files.length > 0) {
            // Validar restricción de máximo 9 imágenes en total
            if (updatedImages.length + req.files.length > 9) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
                return res.status(400).json({
                    msg: 'Error de validación en las imágenes',
                    errors: { images: 'No se pueden asociar más de nueve (9) imágenes a un producto' }
                });
            }

            const newImages = req.files.map(file => ({
                url: `/uploads/products/${file.filename}`,
                isMain: false
            }));

            updatedImages = [...updatedImages, ...newImages];
        }

        // 5. Cambiar imagen principal si se especifica mainImageUrl
        if (inputData.mainImageUrl) {
            const targetMainUrl = inputData.mainImageUrl.trim();
            const exists = updatedImages.some(img => img.url === targetMainUrl);
            if (exists) {
                updatedImages = updatedImages.map(img => ({
                    ...img,
                    isMain: img.url === targetMainUrl
                }));
            }
            delete inputData.mainImageUrl;
        }

        // 6. Asegurar que si hay imágenes, al menos una tenga isMain = true
        if (updatedImages.length > 0) {
            const hasMain = updatedImages.some(img => img.isMain);
            if (!hasMain) {
                updatedImages[0].isMain = true;
            }
        }

        inputData.images = updatedImages;

        // 7. Guardar cambios en la base de datos
        const data = await dbUpdateProduct(id, inputData);

        res.json({
            msg: 'Producto actualizado exitosamente',
            data: data
        });
    } catch (error) {
        console.error(error);

        // Limpieza de archivos si ocurrió un error durante el proceso
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
            await deleteMultipleImages(filePaths);
        }

        res.status(500).json({
            msg: 'Error interno al actualizar el producto'
        });
    }
};
```

---

## 4. Paso a Paso para Estudiantes

1. **Configurar el Middleware**: Asegúrate de envolver la ruta con `handleUploadProductImages` en `src/routes/product.routes.js`.
2. **Obtener el producto actual**: Consulta en MongoDB el estado previo de las imágenes del producto.
3. **Procesar eliminaciones y adiciones**:
   - Primero remueve los archivos físicos solicitados para eliminar.
   - Luego valida que `existentes + nuevas <= 9`.
   - Si se supera el límite, realiza `deleteMultipleImages(req.files)` y responde con un código `400`.
4. **Asignar la imagen principal (`isMain`)**: Garantiza que al menos una imagen conserve `isMain: true`.
5. **Guardar en la base de datos** usando `dbUpdateProduct(id, inputData)`.

---

## 🧪 Guía de Pruebas Paso a Paso en Bruno / Postman

Para ver en detalle los ejemplos de peticiones HTTP, claves `multipart/form-data`, payloads JSON y respuestas esperadas, consulta la guía de pruebas:
👉 **[Guía de Pruebas: Actualización de Imágenes en Bruno / Postman](file:///home/jcarlosj/Projects/E-commerce/docs/backend/guia_pruebas_actualizar_imagenes.md)**

