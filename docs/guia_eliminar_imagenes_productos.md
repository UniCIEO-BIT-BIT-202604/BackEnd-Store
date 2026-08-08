# Guía de Implementación: Eliminación de Imágenes en Productos

Esta guía paso a paso describe los patrones y el código necesario para implementar la **eliminación de imágenes** asociadas a la entidad `Product` dentro del BackEnd.

---

## 1. Casos de Uso de Eliminación

Existen dos escenarios principales al gestionar la eliminación de imágenes en un e-commerce:

### Escenario A: Eliminación del Registro del Producto (`deleteProduct`)
* **Regla**: Si se elimina el registro del producto en la base de datos (`DELETE /api/products/:id`), **todas las imágenes físicas** almacenadas en el servidor (`public/uploads/products/`) deben eliminarse en cascada.

### Escenario B: Eliminación de Imágenes sin Eliminar el Producto (`updateProduct`)
* **Regla**: Es posible eliminar una imagen individual, un conjunto de imágenes o **todas las imágenes** asociadas a un producto sin eliminar el registro del producto en MongoDB.
* El campo `images` en el documento del producto puede quedar como un arreglo vacío `[]`.

---

## 2. Utilidad Helper para la Eliminación de Archivos (`src/helpers/file-storage.js`)

Se utilizan dos funciones auxiliares en Node.js basadas en los módulos del sistema de archivos (`fs` y `path`):

```javascript
import fs from 'fs';
import path from 'path';

// Elimina una sola imagen del servidor de archivos local
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

// Elimina múltiples imágenes en lote
const deleteMultipleImages = async (imagePaths = []) => {
    for (const imagePath of imagePaths) {
        await deleteOldImage(imagePath);
    }
};

export { deleteOldImage, deleteMultipleImages };
```

---

## 3. Eliminación en Cascada al Borrar un Producto (`src/controllers/product.controller.js`)

```javascript
import { dbDeleteProduct } from "../services/product.service.js";
import { deleteMultipleImages } from "../helpers/file-storage.js";

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Eliminar el documento de la base de datos
        const data = await dbDeleteProduct(id);
        if (!data) {
            return res.status(404).json({
                msg: 'No se puede eliminar un producto que no se encuentra registrado'
            });
        }

        // 2. ELIMINACIÓN EN CASCADA DE ARCHIVOS FÍSICOS:
        // Borrar todas las imágenes asociadas del servidor de archivos
        if (data.images && data.images.length > 0) {
            const imagePaths = data.images.map(img => img.url);
            await deleteMultipleImages(imagePaths);
        }

        res.json({
            msg: 'Producto e imágenes eliminadas exitosamente',
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'ERROR: No se pudo eliminar el producto'
        });
    }
};
```

---

## 4. Eliminación de Imágenes Conservando el Registro del Producto

Para eliminar únicamente las imágenes de un producto (o todas sus imágenes a la vez) enviamos una petición `PATCH /api/products/:id`:

### Ejemplo 1: Eliminar TODAS las imágenes de un producto
**Payload JSON en Petición `PATCH`**:
```json
{
  "deleteAllImages": true
}
```

**Lógica en Controlador**:
```javascript
if (inputData.deleteAllImages === 'true' || inputData.deleteAllImages === true) {
    const allUrls = updatedImages.map(img => img.url);
    await deleteMultipleImages(allUrls);
    updatedImages = [];
    delete inputData.deleteAllImages;
}
```

### Ejemplo 2: Eliminar una sola imagen por su URL
**Payload JSON en Petición `PATCH`**:
```json
{
  "deleteImageUrl": "/uploads/products/product-1718000000-12345.png"
}
```

**Lógica en Controlador**:
```javascript
if (inputData.deleteImageUrl) {
    const targetDeleteUrl = inputData.deleteImageUrl.trim();
    await deleteOldImage(targetDeleteUrl);
    updatedImages = updatedImages.filter(img => img.url !== targetDeleteUrl);
    delete inputData.deleteImageUrl;
}
```

---

## 5. Resumen del Flujo de Trabajo para Estudiantes

1. **Si eliminas la entidad Producto**: Usa `dbDeleteProduct(id)` para obtener las URLs guardadas en la BD y llama a `deleteMultipleImages(imagePaths)` para borrar los archivos del disco local.
2. **Si eliminas imágenes individuales/totales**: Extrae la lista de URLs a eliminar, llama a `deleteOldImage` o `deleteMultipleImages`, actualiza el arreglo `images` del producto en MongoDB y guarda los cambios con `dbUpdateProduct`.

---

## 🧪 Guía de Pruebas Paso a Paso en Bruno / Postman

Para ver en detalle los ejemplos de peticiones HTTP, payloads JSON de borrado y respuestas esperadas, consulta la guía de pruebas:
👉 **[Guía de Pruebas: Eliminación de Imágenes en Bruno / Postman](file:///home/jcarlosj/Projects/E-commerce/docs/backend/guia_pruebas_eliminar_imagenes.md)**

