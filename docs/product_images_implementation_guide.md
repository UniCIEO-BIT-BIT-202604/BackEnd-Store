# Guía de Implementación: Gestión de Múltiples Imágenes en Productos

Esta guía paso a paso describe la arquitectura y el código completo necesario para implementar la carga de múltiples imágenes (máximo 9) en la entidad `Product`, la selección de una imagen principal (`isMain`), y la eliminación física en cascada al borrar o actualizar productos.

---

## 1. Modelo de Datos (`src/models/product.model.js`)

Se añade la propiedad `images` como una lista de objetos que guardan la `url` y el indicador `isMain`.

```javascript
import { model, Schema } from 'mongoose';

const ProductSchema = new Schema({
    referenceCode: {
        type: String,
        required: [true, 'El codigo de referencia del producto es obligatorio'],
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        minlength: [3, 'El nombre del producto debe tener al menos 3 caracteres'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio no puede ser un valor negativo'],
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es obligatorio'],
        min: [0, 'El stock no puede ser un valor negativo'],
        default: 1
    },
    status: {
        type: Boolean,
        default: true
    },
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
                    return Array.isArray(val) && val.length > 0;
                },
                message: 'El producto debe incluir al menos una (1) imagen'
            },
            {
                validator: function (val) {
                    return Array.isArray(val) && val.length <= 9;
                },
                message: 'No se pueden asociar más de nueve (9) imágenes a un producto'
            }
        ]
    }
}, {
    versionKey: false,
    timestamps: true
});

const ProductModel = model('product', ProductSchema);
export default ProductModel;
```

---

## 2. Configuración de Multer (`uploadProductImages.middleware.js` y `handleUploadProductImages.middleware.js`)

### A. Configuración del Storage (`src/middlewares/uploadProductImages.middleware.js`)
```javascript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

const uploadProductImages = multer({
    storage: productStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB por archivo
    fileFilter: fileFilter
}).array('images', 9);

export { uploadProductImages };
```

### B. Middleware de Captura de Errores (`src/middlewares/handleUploadProductImages.middleware.js`)
```javascript
import { uploadProductImages } from "./uploadProductImages.middleware.js";

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
```

---

## 3. Helpers de Gestión de Archivos (`src/helpers/file-storage.js`)

Funciones para eliminar imágenes individuales o arreglos de imágenes del disco duro.

```javascript
import fs from 'fs';
import path from 'path';

const deleteOldImage = async (imagePath) => {
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

const deleteMultipleImages = async (imagePaths = []) => {
    for (const imagePath of imagePaths) {
        await deleteOldImage(imagePath);
    }
};

export { deleteOldImage, deleteMultipleImages };
```

---

## 4. Controlador de Productos (`src/controllers/product.controller.js`)

Código completo para crear, actualizar (añadir, borrar o cambiar imagen principal) y eliminar productos en cascada.

```javascript
import mongoose from "mongoose";
import { dbCreateProduct, dbDeleteProduct, dbGetProductById, dbGetProducts, dbUpdateProduct } from "../services/product.service.js";
import { deleteMultipleImages, deleteOldImage } from "../helpers/file-storage.js";

// 1. CREAR PRODUCTO (POST)
const createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                msg: 'Error de validación en los datos del producto',
                errors: { images: 'El producto debe incluir al menos una (1) imagen' }
            });
        }

        const imageObjects = req.files.map((file, index) => ({
            url: `/uploads/products/${file.filename}`,
            isMain: index === 0 // La primera es la principal por defecto
        }));

        const inputData = {
            ...req.body,
            images: imageObjects
        };

        const data = await dbCreateProduct(inputData);

        res.status(201).json({
            msg: 'Crea un nuevo producto',
            data: data
        });
    } catch (error) {
        console.error(error);

        // Limpieza si falla la base de datos
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
            await deleteMultipleImages(filePaths);
        }

        if (error.code === 11000) {
            const errorDetails = {};
            Object.entries(error.keyValue).forEach(([field, value]) => {
                errorDetails[field] = `La propiedad ${field} con el valor ${value} ya se encuentra registrada.`;
            });
            return res.status(400).json({ msg: `Error de validacion por duplicidad en propiedades unicas`, errors: errorDetails });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};
            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });
            return res.status(400).json({ msg: `Error de validacion en propiedades del producto`, errors: errorDetails });
        }

        res.status(500).json({ msg: 'Error: No se pudo crear el producto' });
    }
}

// 2. ACTUALIZAR PRODUCTO (PATCH)
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = { ...req.body };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.files && req.files.length > 0) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
            }
            return res.status(400).json({ msg: 'No se pudo actualizar el producto, por que el ID es invalido' });
        }

        const currentProduct = await dbGetProductById(id);
        if (!currentProduct) {
            if (req.files && req.files.length > 0) {
                const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
                await deleteMultipleImages(filePaths);
            }
            return res.status(404).json({ msg: 'No se pudo actualizar el producto, por que no se encuentra registrado' });
        }

        let updatedImages = currentProduct.images.map(img => (typeof img.toObject === 'function' ? img.toObject() : { ...img }));

        // Accion A: Eliminar una imagen en específico si se recibe deleteImageUrl
        if (inputData.deleteImageUrl) {
            const targetDeleteUrl = inputData.deleteImageUrl.trim();
            await deleteOldImage(targetDeleteUrl);
            updatedImages = updatedImages.filter(img => img.url !== targetDeleteUrl);
            delete inputData.deleteImageUrl;
        }

        // Accion B: Añadir nuevas imágenes si vienen en req.files
        if (req.files && req.files.length > 0) {
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

        // Accion C: Cambiar la imagen principal si se recibe mainImageUrl
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

        // Garantizar al menos una imagen principal
        if (updatedImages.length > 0) {
            const hasMain = updatedImages.some(img => img.isMain);
            if (!hasMain) {
                updatedImages[0].isMain = true;
            }
        }

        inputData.images = updatedImages;

        const data = await dbUpdateProduct(id, inputData);

        res.json({ msg: 'Actualiza un producto', data: data });
    } catch (error) {
        console.error(error);

        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => `/uploads/products/${file.filename}`);
            await deleteMultipleImages(filePaths);
        }

        if (error.code === 11000) {
            const errorDetails = {};
            Object.entries(error.keyValue).forEach(([field, value]) => {
                errorDetails[field] = `El campo '${field}' con el valor '${value}' ya se encuentra registrado.`;
            });
            return res.status(400).json({ msg: `Error de validacion por duplicidad en propiedades unicas`, errors: errorDetails });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};
            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });
            return res.status(400).json({ msg: `Error de validacion en propiedades del producto`, errors: errorDetails });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'No se pudo actualizar el producto, por que el ID es invalido' });
        }

        res.status(500).json({ msg: 'Error: No pudo actualizar el producto por su ID' });
    }
}

// 3. ELIMINAR PRODUCTO EN CASCADA (DELETE)
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'No se puede eliminar, por que el ID proporcionado es invalido' });
        }

        const data = await dbDeleteProduct(id);
        if (!data) {
            return res.json({ msg: 'No se puede eliminar un producto que no se encuentra registrado' });
        }

        // Eliminación física de archivos en servidor
        if (data.images && data.images.length > 0) {
            const imagePaths = data.images.map(img => img.url);
            await deleteMultipleImages(imagePaths);
        }

        res.json({ msg: 'Elimina un producto', data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'ERROR: No pudo eliminar el producto' });
    }
}

export { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
```

---

## 5. Integración en Rutas (`src/routes/product.routes.js`)

```javascript
import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
import { handleUploadProductImages } from "../middlewares/handleUploadProductImages.middleware.js";

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', handleUploadProductImages, createProduct);
productRouter.get('/:id', getProductById);
productRouter.patch('/:id', handleUploadProductImages, updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
```

---

## 6. Pruebas de API en Postman / Bruno

### ⚠️ Regla Importante: `Multipart Form` vs `raw JSON`

* **Subida de Archivos Físicos (`POST /api/products` o `PATCH /api/products/:id` agregando imágenes nuevas):**  
  **OBLIGATORIO usar `Multipart Form` / `form-data`**. HTTP no permite adjuntar archivos físicos de imagen utilizando la opción `raw JSON`. En la pestaña de campos de Bruno/Postman, los datos como `referenceCode`, `name`, `price`, `stock` van como texto y el campo **`images`** va configurado de tipo **File** seleccionando 1 o más imágenes.

* **Actualizaciones de texto y gestión de imágenes existentes (`PATCH /api/products/:id` sin subir archivos nuevos):**  
  **SE PUEDE usar `raw JSON`**. Permite cambiar datos básicos, establecer `mainImageUrl` o solicitar el borrado de una imagen con `deleteImageUrl`.

---

### A. Registrar / Crear Producto (`POST /api/products`)

* **Método:** `POST`
* **URL:** `http://localhost:3000/api/products`
* **Formato:** `Multipart Form` (`form-data`)

| Campo / Key | Tipo | Ejemplo de Valor | Descripción |
| :--- | :--- | :--- | :--- |
| `referenceCode` | Text | `PROD-2026-001` | Código único de referencia (Obligatorio) |
| `name` | Text | `Teclado Mecánico RGB` | Nombre del producto (Mín. 3 caracteres) |
| `description` | Text | `Teclado mecánico con retroalimentación RGB` | Descripción del producto |
| `price` | Text | `69.99` | Precio del producto |
| `stock` | Text | `15` | Stock disponible |
| `status` | Text | `true` | Estado del producto |
| **`images`** | **File** | *(Seleccionar 1 a 9 imágenes)* | Archivos de imagen (JPG, PNG, WEBP, Máx 2MB c/u) |

---

### B. Listar Productos (`GET /api/products`)

#### 1. Obtener todos los productos
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/products`
* **Body:** Ninguno

#### 2. Obtener un producto por ID
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/products/6a664007e03824b3abc70a40`
* **Respuesta de Ejemplo:**
```json
{
  "msg": "Obtiene un producto por ID",
  "data": {
    "_id": "6a664007e03824b3abc70a40",
    "referenceCode": "PROD-2026-001",
    "name": "Teclado Mecánico RGB",
    "description": "Teclado mecánico con retroalimentación RGB",
    "price": 69.99,
    "stock": 15,
    "status": true,
    "images": [
      {
        "url": "/uploads/products/product-1785085959535-780232830.jpg",
        "isMain": true,
        "_id": "6a664007e03824b3abc70a41"
      },
      {
        "url": "/uploads/products/product-1785085959548-767579685.jpg",
        "isMain": false,
        "_id": "6a664007e03824b3abc70a42"
      }
    ],
    "createdAt": "2026-07-26T12:00:00.000Z",
    "updatedAt": "2026-07-26T12:00:00.000Z"
  }
}
```

---

### C. Casos Prácticos para Actualización (`PATCH /api/products/:id`)

#### Caso 1: Actualizar solo información del producto (Sin tocar imágenes)
* **Formato:** `raw JSON`
```json
{
  "name": "Teclado Mecánico RGB Gamer Pro",
  "price": 74.99,
  "stock": 20,
  "description": "Nueva descripción con switches Red y cable removible."
}
```

#### Caso 2: Cambiar la imagen principal (`mainImageUrl`)
* **Formato:** `raw JSON`
* *Pasa en `mainImageUrl` la ruta exacta retornada por la base de datos:*
```json
{
  "mainImageUrl": "/uploads/products/product-1785085959548-767579685.jpg"
}
```

#### Caso 3: Eliminar una imagen existente (`deleteImageUrl`)
* **Formato:** `raw JSON`
* *Pasa en `deleteImageUrl` la ruta exacta de la imagen que deseas borrar físicamente del servidor:*
```json
{
  "deleteImageUrl": "/uploads/products/product-1785085959548-767579685.jpg"
}
```

#### Caso 4: Petición combinada (Editar datos + Cambiar principal + Eliminar una imagen)
* **Formato:** `raw JSON`
```json
{
  "price": 68.00,
  "stock": 12,
  "mainImageUrl": "/uploads/products/product-1785085959548-767579685.jpg",
  "deleteImageUrl": "/uploads/products/product-1785085829999-123456789.jpg"
}
```

---

### D. Eliminar Producto (`DELETE /api/products/:id`)

* **Método:** `DELETE`
* **URL:** `http://localhost:3000/api/products/6a664007e03824b3abc70a40`
* **Body:** Ninguno
* **Comportamiento:** Elimina el documento del producto en MongoDB y realiza borrado físico en cascada de todas las imágenes asociadas almacenadas en la carpeta `public/uploads/products/`.

#### Respuesta de Ejemplo:
```json
{
  "msg": "Elimina un producto",
  "data": {
    "_id": "6a664007e03824b3abc70a40",
    "referenceCode": "PROD-2026-001",
    "name": "Teclado Mecánico RGB Gamer Pro",
    "price": 68,
    "stock": 12,
    "status": true,
    "images": [
      {
        "url": "/uploads/products/product-1785085959548-767579685.jpg",
        "isMain": true
      }
    ]
  }
}
```

---

## 🧪 Guías de Pruebas Paso a Paso en Bruno / Postman

Para realizar pruebas detalladas paso a paso de cada funcionalidad, consulta los guías dedicados:
* 👉 **[Guía de Pruebas: Actualización de Imágenes en Bruno / Postman](file:///home/jcarlosj/Projects/E-commerce/docs/backend/guia_pruebas_actualizar_imagenes.md)**
* 👉 **[Guía de Pruebas: Eliminación de Imágenes en Bruno / Postman](file:///home/jcarlosj/Projects/E-commerce/docs/backend/guia_pruebas_eliminar_imagenes.md)**


