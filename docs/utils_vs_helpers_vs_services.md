# Diferencia entre `utils`, `helpers` y `services` en Node.js / Express

En la arquitectura de software de BackEnd existe frecuentemente el debate sobre cómo organizar las funciones de apoyo. A continuación se explica la convención y las mejores prácticas aceptadas en la industria para diferenciar estos conceptos.

---

## 1. `utils` (Utilities / Utilidades)

Son funciones **puras, genéricas y completamente agnósticas al dominio o lógica de negocio**. Son independientes de tu proyecto; podrías copiar la carpeta `utils` a cualquier otro proyecto (ej. una app financiera, una red social o una app móvil) y funcionará exactamente igual.

### Características:
- **No dependen del estado** ni del modelo de datos del negocio.
- **Funciones puras**: Para los mismos parámetros de entrada, siempre retornan la misma salida sin efectos secundarios.
- **Sin dependencias del entorno**: No realizan llamadas a bases de datos, APIs externas ni al sistema de archivos del servidor.

### Ejemplos comunes:
- Formatear una fecha (`formatDate(date, 'YYYY-MM-DD')`).
- Formatear un valor numérico a moneda (`formatCurrency(1000)`).
- Normalizar un texto o generar un slug (`slugify('Título de Ejemplo')`).
- Validar cadenas de texto o expresiones regulares (`isValidEmail(email)`).

---

## 2. `helpers` (Ayudantes)

Son funciones de apoyo que **sí conocen o dependen del contexto del proyecto, tecnologías específicas o del flujo operativo de la aplicación**. Tienen un acoplamiento intencional con librerías del proyecto, el sistema de archivos o estructuras de datos específicas.

### Características:
- Facilitan tareas operativas y repetitivas dentro de la aplicación.
- Pueden interactuar con el sistema de archivos (`fs`), librerías de terceros (ej. JWT, Bcrypt, Multer) o la base de datos.
- Si las trasladas a otro proyecto, requerirán adaptar rutas, modelos o dependencias.

### Ejemplos comunes:
- Eliminar una foto de avatar del sistema de archivos (`deleteOldImage(path)`).
- Generar o verificar tokens JWT (`generateJWT(payload)`).
- Encriptar o comparar contraseñas (`hashPassword(plainText)`).
- Construir estructuras de respuestas HTTP unificadas (`buildApiResponse(res, data)`).

---

## 3. Lógica de Negocio Pura: `services` (Servicios)

Es importante no confundir ni `helpers` ni `utils` con la **lógica central del negocio**. En arquitecturas modulares (como Controller-Service-Repository o Clean Architecture), las reglas de negocio viven en una capa dedicada llamada **`services`**.

### Características:
- Define las reglas específicas del producto/empresa.
- Orquesta las operaciones entre la base de datos, repositorios y helpers.

### Ejemplo:
- *"Calcular si un usuario aplica para un 10% de descuento por ser cliente VIP y haber realizado más de 3 compras en el mes"*.

---

## Tabla Comparativa Rápida

| Concepto | ¿Conoce el dominio/entorno? | Tipo de función | Ejemplo de aplicación |
| :--- | :--- | :--- | :--- |
| **`utils/`** | ❌ No (Agnóstico / Reusable globalmente) | Pura / Genérica | `capitalize('texto')`, `formatDate()` |
| **`helpers/`** | ⚠️ Sí (Acoplado a librerías/operativa) | Operativa / Apoyo | `deleteOldImage()`, `generateToken()` |
| **`services/`**| 💻 Totalmente enfocado en el Negocio | Regla de Negocio | `applyVipDiscount()`, `processOrder()` |

---

> **Conclusión Práctica**:
> En proyectos pequeños o medianos es habitual ver que se utilice una sola carpeta (`utils/` o `helpers/`). Lo más importante dentro de un equipo de desarrollo es acordar el criterio y **mantener la consistencia** a lo largo de todo el proyecto.
