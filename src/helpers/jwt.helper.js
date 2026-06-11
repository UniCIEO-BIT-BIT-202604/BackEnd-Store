import jwt from 'jsonwebtoken';

const JWT_SEED = process.env.JWT_SEED || '123456789ABCabc';

const generateToken = ( payload ) => {
    try {
        const token = jwt.sign( 
            payload,                // Carga Util 
            JWT_SEED,    // Semilla, Palabra Secreta
            {                       // Configuraciones adicionales
                expiresIn: '1h',    // Tiempo de caducidad
            }     
        );

        return token;
    } catch (error) {
        console.error(error);

        return null;
    }
}

const verifyToken = ( token ) => {  
    try {
        const payload = jwt.verify(
            token,                  // Token 
            JWT_SEED,    // Semilla, Palabra Secreta
        );

        return payload;
    } catch (error) {
        console.error( error );

        return null;
    }
}


export { 
    generateToken,
    verifyToken
};