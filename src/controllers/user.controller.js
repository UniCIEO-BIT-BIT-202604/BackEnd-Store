import { dbGetUsers, dbGetUserById, dbGetUserByIdRaw, dbGetUserByEmail, dbGetUserByNickname, dbCreateUser, dbUpdateUser, dbDeleteUser } from "../services/user.services.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import mongoose from "mongoose";

async function getUsers(req, res) {
    try {
        const users = await dbGetUsers();

        // ENFOQUE PREVENTIVO: Validar directamente si la lista está vacía y responder de inmediato
        // if (users.length === 0) {
        //     return res.status(404).json({
        //         msg: 'No se encontraron usuarios registrados en el sistema'
        //     });
        // }


        // ENFOQUE DE EXCEPCIONES: Lanzar una excepción de negocio si no hay usuarios activos registrados
        if (users.length === 0) {
            throw new Error('No se encontraron usuarios registrados en el sistema');
        }


        res.json({
            data: users
        });
    } catch (error) {
        console.error(error);

        // ENFOQUE DE EXCEPCIONES: Capturar error lanzado: Sin usuarios registrados
        if (error.message.includes('No se encontraron usuarios registrados')) {
            return res.status(404).json({
                msg: error.message
            });
        }


        // Error general interno del servidor
        res.status(500).json({
            msg: 'No se pudo obtener la lista de usuarios'
        });
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;

        /*
        // =========================================================================
        // ENFOQUE ANTERIOR: VALIDACIONES MANUALES DIRECTAS EN CONTROLADOR
        // =========================================================================
        // 1. Validar si el ID proporcionado tiene un formato válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'El ID proporcionado no tiene un formato válido de MongoDB'
            });
        }

        // 2. Validar si el usuario existe físicamente en la base de datos
        const existingUser = await dbGetUserByIdRaw(id);
        if (!existingUser) {
            return res.status(404).json({
                msg: 'El usuario solicitado no existe en el sistema'
            });
        }
        // =========================================================================
        */

        // Proceder a buscar el usuario físicamente en la base de datos
        // Si el formato del ID es inválido, Mongoose disparará automáticamente un CastError
        const existingUser = await dbGetUserByIdRaw(id);

        // Lanzar una excepción de negocio si el usuario no existe en la base de datos
        if (!existingUser) {
            throw new Error('El usuario solicitado no existe en el sistema');
        }

        // Retornar el usuario encontrado con éxito
        res.json({
            data: existingUser
        });
    } catch (error) {
        console.error(error);

        // A. Capturar error lanzado: El usuario no existe en el sistema
        if (error.message.includes('El usuario solicitado no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        // B. Controlar errores de formato de parámetros (Casteo de Mongoose)
        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de usuario provisto es inválido para la base de datos'
            });
        }

        // C. Error general interno del servidor
        res.status(500).json({
            msg: 'No se pudo obtener el usuario'
        });
    }
}

async function createUser(req, res) {
    try {
        const inputData = req.body;
        const { email, nickname, password, confirmPassword } = inputData;

        /*
        // ENFOQUE 2: Validación directa de contraseñas coincidentes y encriptación en el Controlador
        if (!password) {
            return res.status(400).json({
                msg: 'La contraseña es obligatoria'
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                msg: 'Las contraseñas no coinciden'
            });
        }

        // Encriptar la contraseña usando el helper antes de persistir
        inputData.password = await encryptPassword(password);
        */

        /*
        // 1. Validar si el email ya existe en la base de datos
        if (email) {
            const existingEmail = await dbGetUserByEmail(email);
            if (existingEmail) {
                return res.status(400).json({
                    msg: 'El correo electrónico ya se encuentra registrado por otro usuario'
                });
            }
        }

        // 2. Validar si el nickname ya existe en la base de datos
        if (nickname) {
            const existingNickname = await dbGetUserByNickname(nickname);
            if (existingNickname) {
                return res.status(400).json({
                    msg: 'El nickname ya se encuentra en uso por otro usuario'
                });
            }
        }
        */

        const data = await dbCreateUser(inputData);

        res.status(201).json({
            data: data
        });
    } catch (error) {
        console.error(error);

        // A. Controlar errores de validación de campos de Mongoose (Reglas del Schema)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);

            return res.status(400).json({
                msg: 'Error de validación en los datos del usuario',
                errors: messages
            });
        }

        // B. Controlar errores de índices únicos de MongoDB (Código 11000)
        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                email: 'El correo electrónico ya se encuentra registrado por otro usuario',
                nickname: 'El nickname ya se encuentra en uso por otro usuario'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        // C. Error general interno del servidor
        res.status(500).json({
            msg: 'No se pudo registrar el usuario'
        });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const inputData = req.body;

        const data = await dbUpdateUser(id, inputData);

        res.json({
            data: data
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se pudo actualizar el usuario'
        });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        /*
        // =========================================================================
        // ENFOQUE ANTERIOR: VALIDACIONES MANUALES DIRECTAS EN CONTROLADOR
        // =========================================================================
        // 1. Validar si el ID proporcionado es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'El ID proporcionado no tiene un formato válido de MongoDB'
            });
        }

        // Obtener el usuario de la base de datos
        const existingUser = await dbGetUserByIdRaw(id);

        // 2. Validar si el usuario existe físicamente en la base de datos
        if (!existingUser) {
            return res.status(404).json({
                msg: 'El usuario que deseas eliminar no existe en el sistema'
            });
        }

        // 3. Proteger cuentas administrativas esenciales del sistema
        if (existingUser.role === 'administrator') {
            return res.status(403).json({
                msg: 'Operación denegada: No está permitido eliminar usuarios con rol de administrador'
            });
        }
        // =========================================================================
        */

        // Proceder a la eliminación física definitiva
        // Nota: Mongoose ejecutará automáticamente el hook 'pre-findOneAndDelete' del Modelo
        // para validar la existencia física del usuario y la protección del rol de administrador.
        const data = await dbDeleteUser(id);

        res.json({
            msg: 'Usuario eliminado exitosamente',
            data: data
        });
    } catch (error) {
        console.error(error);

        // A. Capturar error lanzado por el Modelo: El usuario no existe en la BD
        if (error.message.includes('El usuario que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        // B. Capturar error lanzado por el Modelo: Protección del rol administrativo
        if (error.message.includes('No está permitido eliminar usuarios con rol de administrador')) {
            return res.status(403).json({
                msg: error.message
            });
        }

        // C. Controlar errores de formato de parámetros (Casteo de Mongoose)
        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de usuario provisto es inválido para la base de datos'
            });
        }

        // D. Error general interno del servidor
        res.status(500).json({
            msg: 'No se pudo eliminar el usuario'
        });
    }
}

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};