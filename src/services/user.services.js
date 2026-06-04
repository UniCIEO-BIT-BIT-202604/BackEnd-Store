import UserModel from "../models/user.model.js";


const dbGetUsers = async () => {
    return await UserModel.find({ status: true });
};

const dbGetUserById = async (id) => {
    return await UserModel.findOne({ _id: id, status: true });
};

const dbGetUserByIdRaw = async (id) => {
    return await UserModel.findById(id);
};

const dbGetUserByEmail = async (email) => {
    if (!email) {
        throw new Error('Se olvidó pasar la propiedad email en el login');
    }

    return await UserModel.findOne({ email: email.toLowerCase() });
};

const dbGetUserByNickname = async (nickname) => {
    return await UserModel.findOne({ nickname: nickname.toLowerCase() });
};

const dbCreateUser = async (newUser) => {
    // Registra el nuevo usuario en la base de datos (con su contraseña ya procesada por los hooks)
    const data = await UserModel.create(newUser);

    /*
    // ENFOQUE MANUAL: Limpieza del password si NO existiera 'toJSON' en el modelo
    // Convertimos el documento de Mongoose a un objeto plano de JavaScript (JS Object)
    const userObject = data.toObject();
    
    // Eliminamos la propiedad password para que no viaje en el retorno del servicio ni sea expuesta
    delete userObject.password;
    
    return userObject;
    */

    return data;
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
    dbGetUserByIdRaw,
    dbGetUserByEmail,
    dbGetUserByNickname,
    dbCreateUser,
    dbUpdateUser,
    dbDeleteUser
};
