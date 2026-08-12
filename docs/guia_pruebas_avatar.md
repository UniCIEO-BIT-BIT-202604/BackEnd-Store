# Guía de Pruebas: Gestión de Avatares de Usuario en Bruno / Postman

Esta guía detalla los pasos para probar la **creación, actualización, restablecimiento y eliminación de avatares de usuario** en Bruno o Postman.

---

## 📌 Prueba 1: Crear Usuario con Foto de Avatar (`multipart/form-data`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `POST`
* **URL**: `http://localhost:3000/api/users`
* **Body Type**: `multipart/form-data`

### Parámetros Form-Data:
| Key | Type | Value |
| :--- | :--- | :--- |
| `name` | **Text** | `Juan Carlos` |
| `nickname` | **Text** | `jcarlos` |
| `email` | **Text** | `jcarlos@correo.com` |
| `password` | **Text** | `123456` |
| `avatarUrl` | **File** | `mi-foto.png` |

### Respuesta Esperada (`201 Created`):
```json
{
  "msg": "Registra el usuario de forma publica exitosamente",
  "data": {
    "_id": "67a710000000000000000001",
    "name": "Juan Carlos",
    "nickname": "jcarlos",
    "email": "jcarlos@correo.com",
    "avatarUrl": "uploads/avatars/avatar-1718000000-999.png",
    "role": "customer"
  }
}
```

---

## 📌 Prueba 2: Actualizar Foto de Avatar (`multipart/form-data`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/users/ID_DEL_USUARIO`
* **Body Type**: `multipart/form-data`

### Parámetros Form-Data:
| Key | Type | Value |
| :--- | :--- | :--- |
| `avatarUrl` | **File** | `nueva-foto.png` |

### Respuesta Esperada (`200 OK`):
```json
{
  "data": {
    "_id": "67a710000000000000000001",
    "avatarUrl": "uploads/avatars/avatar-1718000000-888.png"
  }
}
```
> **Verificación**: La foto anterior `avatar-1718000000-999.png` es eliminada automáticamente del disco local (`public/uploads/avatars/`).

---

## 📌 Prueba 3: Restablecer Avatar a la Imagen por Defecto (`application/json`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `PATCH`
* **URL**: `http://localhost:3000/api/users/ID_DEL_USUARIO`
* **Body Type**: `JSON` (`application/json`)

### Payload JSON enviado:
```json
{
  "avatarUrl": ""
}
```

### Respuesta Esperada (`200 OK`):
```json
{
  "data": {
    "_id": "67a710000000000000000001",
    "avatarUrl": "uploads/avatars/default-avatar.png"
  }
}
```

---

## 📌 Prueba 4: Eliminar Usuario y su Foto de Avatar (`DELETE`)

### Configuración en Bruno / Postman:
* **Método HTTP**: `DELETE`
* **URL**: `http://localhost:3000/api/users/ID_DEL_USUARIO`
* **Body Type**: `None`

### Respuesta Esperada (`200 OK`):
```json
{
  "msg": "Usuario eliminado exitosamente",
  "data": {
    "_id": "67a710000000000000000001",
    "name": "Juan Carlos"
  }
}
```
> **Verificación**: Si el usuario tenía una foto personalizada, el archivo físico se elimina de la carpeta `public/uploads/avatars/`. Si tenía la imagen por defecto `default-avatar.png`, no se borra.
