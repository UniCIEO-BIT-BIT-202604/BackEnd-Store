import jwt from 'jsonwebtoken';

const generateToken = ( payload ) => {
    try {
        const token = jwt.sign( 
            payload,                // Carga Util 
            'erttyhrefwdefgthm',    // Semilla, Palabra Secreta
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


export { generateToken };