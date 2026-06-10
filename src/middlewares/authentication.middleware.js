import { verifyToken } from "../helpers/jwt.helper.js";
import { dbGetUserByEmail } from "../services/user.services.js";

const authenticationUser = async ( req, res, next ) => {
    // Paso 1: Obtengo la cadena que "contiente" el Token
    const token = req.header( 'X-Token' );

    if( ! token ) {
        return res.status( 401 ).json({
            msg: 'Cadena de Token vacia'
        });
    }

    // Paso 2: Verificar "formato" del Token
    const tokenParts = token.split( '.' );

    if( tokenParts.length !== 3 ) {
        return res.status(400).json({
            msg: 'Formato del token invalido'
        });
    }

    // Paso 3: Verificar la Autenticidad del Token y Extraer el payload
    const payload = verifyToken( token );

    if( ! payload ) {
        return res.status( 400 ).json({
            msg: 'Token invalido o inactivo'
        })
    }

    // Paso 4: Verificar si el usuario dentro del payload del token existe y sigue activo
    const userFound = await dbGetUserByEmail( payload.email );

    // Verifica si el usuario existe o esta inhabilitado
    if( ! userFound ) {
        return res.status(400).json({
            msg: 'No es posible generar el nuevo Token'
        });
    }

    // Paso 5: Eliminar las propiedades innecesarias para crear el payload para el nuevo Token
    const userFoundObj = userFound.toObject();

    delete userFoundObj.password;
    delete userFoundObj.createdAt;
    delete userFoundObj.updatedAt;

    console.log( 'Yo soy Middleware ', userFoundObj );

    // Paso 6: Creo las propiedades que almacenaran los datos que quiero pasar a la siguiente funcion (que pueden ser: otro middleware o el controller)
    req.payload = userFoundObj;
    req.user = userFound;

    // Paso 7: La autorización para ejecutar la funcion (que pueden ser: otro middleware o el controller)
    next();
}

export default authenticationUser;