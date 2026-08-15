# Guía de Pruebas Manuales para el Dominio de Catálogo (Categories, Products & Variants)

Esta guía detalla el paso a paso estructurado para probar manualmente mediante **Postman**, **Bruno**, **Insomnia** o **cURL** los 3 modelos del catálogo (`Category`, `Product` y `Variant`).

---

## ⚙️ Configuración Previa

* **URL Base:** `http://localhost:5000/api` (o el puerto configurado en tu servidor `.env`).
* **Headers globales:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <TU_TOKEN_JWT_ADMIN>` *(Solo para peticiones `POST`, `PUT`, `PATCH`, `DELETE`)*

---

## 🗂️ FASE 1: Pruebas del Módulo de Categorías (`Category`)

### 1.1 Crear Categoría Raíz (Padre)
* **Método:** `POST`
* **URL:** `http://localhost:5000/api/categories`
* **Cuerpo de la Petición (Body JSON):**
```json
{
  "name": "Hombre",
  "description": "Sección principal de vestimenta y calzado para hombre",
  "displayOrder": 1,
  "isFeatured": true,
  "imageUrl": "https://midominio.com/imagenes/categorias/hombre.jpg"
}
```
* **Respuesta Esperada (201 Created):** Retorna el objeto creado con su `_id` generado y el `slug: "hombre"` generado automáticamente.
* 📌 **Guarda el `_id` generado para los siguientes pasos (ej: `ID_CATEGORIA_HOMBRE`).**

---

### 1.2 Crear Subcategoría con Tallas Permitidas
* **Método:** `POST`
* **URL:** `http://localhost:5000/api/categories`
* **Body JSON:**
```json
{
  "name": "Calzado Masculino",
  "description": "Tennis y zapatos deportivos para caballero",
  "parentCategory": "<ID_CATEGORIA_HOMBRE>",
  "sizes": ["38", "39", "40", "41", "42"],
  "sizeGuide": "https://midominio.com/guias/tallas-calzado.pdf",
  "displayOrder": 2
}
```
* **Respuesta Esperada (201 Created):** Retorna el objeto con `slug: "calzado-masculino"` y la relación a su categoría padre.
* 📌 **Guarda el `_id` generado (ej: `ID_CALZADO_MASCULINO`).**

---

### 1.3 Obtener Árbol Jerárquico Completo (Navbar Menu)
* **Método:** `GET`
* **URL:** `http://localhost:5000/api/categories/tree`
* **Respuesta Esperada (200 OK):** Retorna las categorías raíz con su propiedad `children: [...]` anidando las subcategorías.

---

### 1.4 Obtener Categoría por Slug SEO
* **Método:** `GET`
* **URL:** `http://localhost:5000/api/categories/slug/calzado-masculino`
* **Respuesta Esperada (200 OK):** Retorna la información completa de la categoría poblando los datos del `parentCategory`.

---

### 1.5 Cambiar Estado en Cascada (Activar/Desactivar)
* **Método:** `PATCH`
* **URL:** `http://localhost:5000/api/categories/<ID_CATEGORIA_HOMBRE>/status`
* **Body JSON:**
```json
{
  "isActive": false
}
```
* **Respuesta Esperada (200 OK):** Desactiva en cascada la categoría `Hombre` y a todas sus subcategorías (`Calzado Masculino`). *(Ejecuta luego con `isActive: true` para reactivarlas)*.

---

## 👕 FASE 2: Pruebas del Módulo de Productos (`Product`)

### 2.1 Crear Producto Válido
* **Método:** `POST`
* **URL:** `http://localhost:5000/api/products`
* **Body JSON:**
```json
{
  "name": "Tennis Running Ultraboost",
  "brand": "Adidas",
  "description": "Zapatos deportivos de alto rendimiento con suela antideslizante",
  "basePrice": 350000,
  "offerPrice": 299900,
  "category": "<ID_CALZADO_MASCULINO>",
  "gender": "men",
  "specifications": [
    { "name": "Tipo de Suela", "value": "Goma EVA y Caucho" },
    { "name": "Tipo de Ajuste", "value": "Cordones elásticos" }
  ],
  "shipping": {
    "weightGrams": 850,
    "dimensions": {
      "heightCm": 12,
      "widthCm": 20,
      "lengthCm": 32
    }
  },
  "generalImages": ["https://midominio.com/imagenes/productos/ultraboost-1.jpg"],
  "variants": [
    {
      "sku": "TEN-ADI-NEGRO-39",
      "size": "39",
      "color": { "name": "Negro", "hex": "#000000" },
      "stock": 15,
      "additionalPrice": 0
    },
    {
      "sku": "TEN-ADI-NEGRO-40",
      "size": "40",
      "color": { "name": "Negro", "hex": "#000000" },
      "stock": 10,
      "additionalPrice": 0
    }
  ],
  "tags": ["tennis", "running", "deporte", "calzado"]
}
```
* **Respuesta Esperada (201 Created):** Retorna el producto con su `slug: "tennis-running-ultraboost"` generado.
* 📌 **Guarda el `_id` del producto (ej: `ID_PRODUCTO_ULTRABOOST`).**

---

### 2.2 Probar Validación de Negocio (Talla No Permitida)
* **Método:** `POST`
* **URL:** `http://localhost:5000/api/products`
* **Body JSON:** Intenta registrar una variante con talla `"XL"` en la categoría *Calzado Masculino* (que solo admite `["38", "39", "40", "41", "42"]`):
```json
{
  "name": "Zapato Error Test",
  "brand": "Nike",
  "description": "Prueba de error de validación",
  "basePrice": 100000,
  "category": "<ID_CALZADO_MASCULINO>",
  "gender": "men",
  "variants": [
    {
      "sku": "ZAP-ERR-XL",
      "size": "XL",
      "color": { "name": "Azul" },
      "stock": 5
    }
  ]
}
```
* **Respuesta Esperada (400 Bad Request):**
```json
{
  "msg": "Error de validación de negocio",
  "error": "La talla 'XL' no es permitida para la categoría 'Calzado Masculino'. Tallas válidas: [38, 39, 40, 41, 42]"
}
```

---

### 2.3 Listar Productos Paginados y Filtrados
* **Método:** `GET`
* **URL:** `http://localhost:5000/api/products?gender=men&brand=Adidas&sortBy=price_asc&page=1&limit=5`
* **Respuesta Esperada (200 OK):** Retorna la lista paginada junto con los datos de paginación (`totalItems`, `totalPages`, `currentPage`).

---

### 2.4 Obtener Producto por Slug SEO
* **Método:** `GET`
* **URL:** `http://localhost:5000/api/products/slug/tennis-running-ultraboost`
* **Respuesta Esperada (200 OK):** Retorna la ficha técnica del producto.

---

## 🎨 FASE 3: Pruebas del Módulo de Variantes (`Variant`)

### 3.1 Listar Variantes de un Producto
* **Método:** `GET`
* **URL:** `http://localhost:5000/api/products/<ID_PRODUCTO_ULTRABOOST>/variants`
* **Respuesta Esperada (200 OK):** Lista el array de variantes asociadas al producto.

---

### 3.2 Agregar Nueva Variante a un Producto Existente
* **Método:** `POST`
* **URL:** `http://localhost:5000/api/products/<ID_PRODUCTO_ULTRABOOST>/variants`
* **Body JSON:**
```json
{
  "sku": "TEN-ADI-ROJO-41",
  "size": "41",
  "color": {
    "name": "Rojo Carmesí",
    "hex": "#DC143C"
  },
  "stock": 8,
  "additionalPrice": 10000,
  "images": ["https://midominio.com/imagenes/productos/ultraboost-rojo-41.jpg"]
}
```
* **Respuesta Esperada (201 Created):** Inserta la variante usando `$push` y retorna el producto actualizado.

---

### 3.3 Consultar Variante por SKU
* **Método:** `GET`
* **URL:** `http://localhost:5000/api/products/<ID_PRODUCTO_ULTRABOOST>/variants/TEN-ADI-ROJO-41`
* **Respuesta Esperada (200 OK):** Retorna únicamente la variante solicitada.

---

### 3.4 Actualizar Inventario / Stock de una Variante
* **Método:** `PATCH`
* **URL:** `http://localhost:5000/api/products/<ID_PRODUCTO_ULTRABOOST>/variants/TEN-ADI-ROJO-41/stock`
* **Body JSON:**
```json
{
  "stock": 50
}
```
* **Respuesta Esperada (200 OK):** Actualiza el stock de esa variante específica mediante la operación posicional `variants.$.stock`.

---

### 3.5 Eliminar Variante por SKU
* **Método:** `DELETE`
* **URL:** `http://localhost:5000/api/products/<ID_PRODUCTO_ULTRABOOST>/variants/TEN-ADI-ROJO-41`
* **Respuesta Esperada (200 OK):** Remueve la variante del array usando la operación `$pull` de MongoDB.

---

## 🗑️ FASE 4: Prueba de Borrado Físico en Cascada

### 4.1 Eliminar Categoría Padre e Hijas en Cascada
* **Método:** `DELETE`
* **URL:** `http://localhost:5000/api/categories/<ID_CATEGORIA_HOMBRE>`
* **Respuesta Esperada (200 OK):**
```json
{
  "msg": "Categoría y sus subcategorías eliminadas exitosamente en cascada (2 registros afectados)",
  "data": {
    "deletedCount": 2,
    "affectedIds": ["<ID_CATEGORIA_HOMBRE>", "<ID_CALZADO_MASCULINO>"]
  }
}
```
