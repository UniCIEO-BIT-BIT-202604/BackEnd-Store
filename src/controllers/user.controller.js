import { dbGetUsers, dbGetUserById, dbGetUserByEmail, dbGetUserByNickname, dbCreateUser, dbUpdateUser, dbDeleteUser } from "../services/user.services.js";

async function getUsers(req, res) {
    try {
        const users = await dbGetUsers();

        res.json({
            data: users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se pudo obtener la lista de usuarios'
        });
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const data = await dbGetUserById(id);

        res.json({
            data: data
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se pudo obtener el usuario'
        });
    }
}

async function createUser(req, res) {
    try {
        const inputData = req.body;
        const { email, nickname } = inputData;

        /*
        // ENFOQUE 2: Validación directa a nivel de Controlador (Descomentar para usar)
        const { password, confirmPassword } = inputData;
        if (password !== confirmPassword) {
            return res.status(400).json({
                msg: 'Las contraseñas no coinciden'
            });
        }
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

        const data = await dbDeleteUser(id);

        res.json({
            msg: 'Usuario eliminado exitosamente',
            data: data
        });
    } catch (error) {
        console.error(error);

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