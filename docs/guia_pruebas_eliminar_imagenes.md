# Guía de Pruebas: Eliminación de Imágenes en Bruno / Postman

Esta guía paso a paso describe cómo probar todos los casos de uso de **eliminación de imágenes** (parcial, total y en cascada) en **Bruno** o **Postman**.

---

## 📌 Prueba 1: Eliminar una Sola Imagen Específica del Producto (`application/json`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/products/ID_DEL_PRODUCTO`
* **Body Type**: `JSON` (`application/json`)

### Payload JSON enviado:
```json
{
  "deleteImageUrl": "/uploads/products/product-1718000000-222.png"
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
        "isMain": true
      }
    ]
  }
}
```
> **Verificación en Disco**: Comprobar en la carpeta `BackEnd/public/uploads/products/` que el archivo `product-1718000000-222.png` fue eliminado del sistema de archivos local.

---

## 📌 Prueba 2: Eliminar un Arreglo de Imágenes Específicas (`application/json`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/products/ID_DEL_PRODUCTO`
* **Body Type**: `JSON` (`application/json`)

### Payload JSON enviado:
```json
{
  "deleteImageUrls": [
    "/uploads/products/product-1718000000-111.png",
    "/uploads/products/product-1718000000-333.png"
  ]
}
```

### Respuesta Esperada (`200 OK`):
```json
{
  "msg": "Actualiza un producto",
  "data": {
    "_id": "67a73f1a2b3c4d5e6f7a8b9c",
    "images": []
  }
}
```

---

## 📌 Prueba 3: Eliminar TODAS las Imágenes Conservando el Registro del Producto

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/products/ID_DEL_PRODUCTO`
* **Body Type**: `JSON` (`application/json`)

### Payload JSON enviado:
```json
{
  "deleteAllImages": true
}
```

### Respuesta Esperada (`200 OK`):
```json
{
  "msg": "Actualiza un producto",
  "data": {
    "_id": "67a73f1a2b3c4d5e6f7a8b9c",
    "name": "Hamburguesa Artesanal Especial",
    "images": []
  }
}
```
> **Verificación**: El producto conserva su registro en la base de datos MongoDB con `images: []`, y todas sus imágenes físicas previamente almacenadas en la carpeta `public/uploads/products/` han sido borradas del servidor.

---

## 📌 Prueba 4: Eliminación en Cascada (Eliminar el Producto Completo)

### Configuración en Bruno / Postman:
* **Método HTTP**: `DELETE`
* **URL**: `http://localhost:3000/api/products/ID_DEL_PRODUCTO`
* **Body Type**: `None`

### Respuesta Esperada (`200 OK`):
```json
{
  "msg": "Elimina un producto",
  "data": {
    "_id": "67a73f1a2b3c4d5e6f7a8b9c",
    "name": "Hamburguesa Artesanal Especial",
    "images": [
      {
        "url": "/uploads/products/product-1718000000-111.png",
        "isMain": true
      }
    ]
  }
}
```
> **Verificación**: El producto es eliminado físicamente de la BD y **todas** las imágenes asociadas en `public/uploads/products/` son desvinculadas y eliminadas del disco en cascada.
