import { genSaltSync, hashSync } from 'bcrypt';

// originalPassword: 123456789
const encryptedPassword = ( originalPassword ) => {
    // Paso 1: Generar una cadena aleatoria (salt)
    const salt = genSaltSync( 4 );
    // console.log( 'salt: ', salt );

    // Paso 2: Encripta la contraseña 
    const hashPassword = hashSync( 
        originalPassword,        // Password Original (123456789) 
        salt                     // Salt (Cadena Aleatoria)
    );

    // Paso 3: Password Encriptado listo para registrar
    return hashPassword;        
}

export {
    encryptedPassword
};