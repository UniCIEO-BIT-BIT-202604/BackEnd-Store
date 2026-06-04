import { genSaltSync, hashSync, compareSync } from 'bcrypt';

// originalPassword: 123456789
const encryptedPassword = (originalPassword) => {
    try {
        // Paso 1: Generar una cadena aleatoria (salt)
        const salt = genSaltSync(4);
        // console.log( 'salt: ', salt );

        // Paso 2: Encripta la contraseña 
        const hashPassword = hashSync(
            originalPassword,        // Password Original (123456789) 
            salt                     // Salt (Cadena Aleatoria)
        );

        // Paso 3: Password Encriptado listo para registrar
        return hashPassword;
    } catch (error) {
        console.error(error);

        return null;
    }
}

const validatePassword = (originalPassword, hashPassword) => {
    try {
        const isValid = compareSync(
            originalPassword,           // (123456789) 
            hashPassword                // (Viene del usuario encontrado en la base de datos)
        );

        return isValid;             // true/false
    } catch (error) {
        console.error(error);

        return null;
    }
}


export {
    encryptedPassword,
    validatePassword
};