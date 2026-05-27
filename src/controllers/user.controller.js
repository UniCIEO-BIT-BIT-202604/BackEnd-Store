import { dbGetUsers, dbGetUserById, dbCreateUser, dbUpdateUser, dbDeleteUser } from "../services/user.services.js";

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

        const data = await dbCreateUser(inputData);

        res.status(201).json({
            data: data
        });
    } catch (error) {
        console.error(error);

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