import { validatePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { dbGetUserByEmail } from "../services/user.services.js";

const loginUser = async (req, res) => {
    try {
        // Paso 1: Extraer los datos del cuerpo de la peticion
        const inputData = req.body;     // { email: '', password: ''}

        // if (!inputData.email) {
        //     throw new Error('Se olvidó pasar la propiedad email en el login');
        // }

        if (!inputData.password) {
            throw new Error('Se olvidó pasar la propiedad password en el login');
        }

        // Paso 2: Verificar si el usuario existe 
        const userFound = await dbGetUserByEmail(inputData.email);

        if (!userFound) {
            throw new Error('El usuario no existe, por favor registrese');
        }

        // Paso 3: Verificar si la contraseña es valida
        const isValid = validatePassword(inputData.password, userFound.password);

        if (!isValid) {
            throw new Error('Sus credenciales no son validas');
        }

        // Paso 4: Generar el token 
        const payload = {
            _id: userFound._id,
            name: userFound.name,
            nickname: userFound.nickname,
            email: userFound.email,
            role: userFound.role,
            avatar: userFound.avatar,
            status: userFound.status
        };

        const token = generateToken(payload);

        if (token === null) {
            throw new Error('No se pudo generar el token de acceso');
        }

        // Paso 5: Convertir un BJSON en JSON para eliminar la propiedad password
        const userFoundObj = userFound.toObject();

        delete userFoundObj.password;

        // Paso 6: Responde al cliente enviandole el token
        res.json({
            msg: 'Login exitoso',
            token,
            data: userFoundObj
        });
    } catch (error) {
        console.error(error);

        // A. Controlar errores de validación de campos del Login (Negocio)
        if (
            error.message.includes('Se olvidó pasar') ||
            error.message.includes('El usuario no existe') ||
            error.message.includes('Sus credenciales no son validas')
        ) {
            return res.status(400).json({
                msg: error.message
            });
        }

        // B. Controlar error al generar el token (Internal Server Error)
        if (error.message.includes('No se pudo generar el token de acceso')) {
            return res.status(500).json({
                msg: error.message
            });
        }

        // C. Error general interno del servidor (p. ej. error en la base de datos o de sintaxis)
        res.status(500).json({
            msg: 'Ocurrió un error en el servidor durante el login'
        });
    }
}

const reNewToken = ( req, res ) => {

    const payload = req.payload;
    const user = req.user;

    // Creacion del nuevo Token

    res.json({
        msg: 'Aqui se renueva el Token',
        payload,
        user
    });
}


export {
    loginUser,
    reNewToken
};