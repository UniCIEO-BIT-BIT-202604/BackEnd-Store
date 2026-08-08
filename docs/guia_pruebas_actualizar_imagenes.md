# Guía de Pruebas: Actualización de Imágenes en Bruno / Postman

Esta guía paso a paso describe cómo probar la funcionalidad de **actualización de imágenes de productos** en **Bruno** o **Postman**, detallando los métodos HTTP, las URLs, los tipos de cuerpo (Body), las claves, valores y los JSONs esperados.

---

## Prerrequisitos
1. Servidor de Express en ejecución (`http://localhost:3000`).
2. Tener creado al menos un producto en la base de datos (con su respectivo ID de MongoDB, ej: `67a73f1a2b3c4d5e6f7a8b9c`).
3. Imágenes de prueba en tu equipo (`.jpg`, `.png`, `.webp` menores a 2MB).

---

## 📌 Prueba 1: Agregar Nuevas Imágenes a un Producto (`multipart/form-data`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/products/ID_DEL_PRODUCTO` (Reemplazar `ID_DEL_PRODUCTO` por un ObjectId real).
* **Body Type**: `multipart/form-data`

### Parámetros Form-Data:
| Key | Type | Value | Descripción |
| :--- | :--- | :--- | :--- |
| `images` | **File** | `imagen1.png` | Seleccionar un archivo de imagen local |
| `images` | **File** | `imagen2.jpg` | Seleccionar un segundo archivo (se pueden enviar múltiples claves `images`) |
| `name` | **Text** | *(Opcional)* | Si deseas actualizar también el nombre del producto |

### Respuesta Esperada (`200 OK`):
```json
{
  "msg": "Actualiza un producto",
  "data": {
    "_id": "67a73f1a2b3c4d5e6f7a8b9c",
    "referenceCode": "PROD-001",
    "name": "Hamburguesa Artesanal Especial",
    "price": 25000,
    "images": [
      {
        "url": "/uploads/products/product-1718000000-111.png",
        "isMain": true,
        "_id": "67a73f1a2b3c4d5e6f7a8b9d"
      },
      {
        "url": "/uploads/products/product-1718000000-222.png",
        "isMain": false,
        "_id": "67a73f1a2b3c4d5e6f7a8b9e"
      }
    ]
  }
}
```

---

## 📌 Prueba 2: Cambiar la Imagen Principal del Producto (`application/json`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/products/ID_DEL_PRODUCTO`
* **Body Type**: `JSON` (`application/json`)

### Payload JSON enviado:
```json
{
  "mainImageUrl": "/uploads/products/product-1718000000-222.png"
}
```

### Respuesta Esperada (`200 OK`):
```json
{
  "msg": "Actualiza un producto",
  "data": {
    "_id": "67a73f1a2b3c4d5e6f7a8b9c",
    "images": [
      {
        "url": "/uploads/products/product-1718000000-111.png",
        "isMain": false
      },
      {
        "url": "/uploads/products/product-1718000000-222.png",
        "isMain": true
      }
    ]
  }
}
```

---

## 📌 Prueba 3: Exceder el Límite de 9 Imágenes (Prueba de Error `400`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/products/ID_DEL_PRODUCTO`
* **Body Type**: `multipart/form-data`
* **Acción**: Adjuntar archivos `images` hasta intentar superar el total de 9 imágenes asociadas al producto.

### Respuesta Esperada (`400 Bad Request`):
```json
{
  "msg": "Error de validación en las imágenes",
  "errors": {
    "images": "No se pueden asociar más de nueve (9) imágenes a un producto"
  }
}
```
> **Verificación en Servidor**: Los archivos físicos recién subidos en esa petición deben haber sido borrados automáticamente del directorio `public/uploads/products/`.
