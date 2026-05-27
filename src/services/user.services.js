import UserModel from "../models/user.model.js";


const dbGetUsers = async () => {
    return await UserModel.find({ status: true });
};

const dbGetUserById = async (id) => {
    return await UserModel.findOne({ _id: id, status: true });
};

const dbGetUserByEmail = async (email) => {
    return await UserModel.findOne({ email: email.toLowerCase() });
};

const dbGetUserByNickname = async (nickname) => {
    return await UserModel.findOne({ nickname: nickname.toLowerCase() });
};

const dbCreateUser = async (newUser) => {
    return await UserModel.create(newUser);
};


const dbUpdateUser = async (id, updateData) => {
    return await UserModel.findByIdAndUpdate(
        id,          // Identificador único del usuario a modificar
        updateData,  // Objeto que contiene los nuevos datos a guardar
        {
            returnDocument: 'after', // Retorna el documento actualizado en lugar del original (reemplaza a new: true en Mongoose 9)
            runValidators: true      // Ejecuta las validaciones del Schema al actualizar
        }
    );
};

const dbDeleteUser = async (id) => {
    return await UserModel.findByIdAndDelete(id);
};


export {
    dbGetUsers,
    dbGetUserById,
    dbGetUserByEmail,
    dbGetUserByNickname,
    dbCreateUser,
    dbUpdateUser,
    dbDeleteUser
};
