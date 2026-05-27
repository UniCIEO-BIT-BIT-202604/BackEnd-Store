import { Schema, model } from "mongoose";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'],
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },
    nickname: {
        type: String,
        required: [true, 'El nickname es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9]+$/, 'El nickname solo puede contener caracteres alfanuméricos (sin espacios ni caracteres especiales)'],
        minlength: [3, 'El nickname debe tener al menos 3 caracteres'],
        maxlength: [20, 'El nickname no puede exceder los 20 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Por favor, ingresa un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        required: true,
        enum: ['administrator', 'editor', 'author', 'contributor', 'subscriber'],
        default: 'subscriber'
    },
    status: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        default: ''
    }
}, {
    versionKey: false,
    timestamps: true
});

// Campo virtual para confirmar la contraseña (no se almacena en la base de datos)
UserSchema.virtual('confirmPassword')
    .set(function (value) {
        this._confirmPassword = value;
    })
    .get(function () {
        return this._confirmPassword;
    });

// Hook de pre-validación: se ejecuta justo antes de que Mongoose valide las reglas del Schema.
// Al usar la sintaxis síncrona sin parámetros, evitamos problemas de compatibilidad con 'next'.
UserSchema.pre('validate', function () {
    // Verifica si la contraseña está siendo creada por primera vez o si ha sido modificada
    if (this.isModified('password')) {
        // Valida si el campo virtual confirmPassword no fue enviado o está vacío en la petición
        if (!this.confirmPassword) {
            // Marca el campo confirmPassword como inválido y le asocia un mensaje de error personalizado
            this.invalidate('confirmPassword', 'Debes confirmar la contraseña');
        // Valida si el password real no es exactamente igual al confirmPassword virtual recibido
        } else if (this.password !== this.confirmPassword) {
            // Si no coinciden, marca el campo confirmPassword como inválido con un mensaje de error
            this.invalidate('confirmPassword', 'Las contraseñas no coinciden');
        }
    }
});

// Hook de pre-save: se ejecuta justo antes de guardar o insertar físicamente el documento en MongoDB.
// Al declarar la función como 'async' sin parámetros, Mongoose detecta automáticamente el retorno de la promesa sin requerir 'next'.
UserSchema.pre('save', async function () {
    // Si la contraseña no ha sufrido cambios (por ejemplo, si se actualiza otro campo del perfil), salta la encriptación
    if (!this.isModified('password')) return;

    // Encripta la contraseña en texto plano usando el helper asíncrono y reemplaza el valor original con el hash seguro
    this.password = await encryptPassword(this.password);
});

// Hook de pre-findOneAndDelete: intercepta la eliminación (findByIdAndDelete o findOneAndDelete) 
// para validar existencia y denegar la eliminación de cuentas administrativas desde el Schema.
UserSchema.pre('findOneAndDelete', async function () {
    // Obtenemos el criterio de búsqueda (filtro) de la consulta actual (ej: { _id: id })
    const query = this.getQuery();
    
    // Buscamos físicamente el documento en la base de datos antes de ejecutar la eliminación
    const user = await this.model.findOne(query);
    
    // Si el documento ya no existe, arrojamos un error que viajará al catch del controlador
    if (!user) {
        throw new Error('El usuario que deseas eliminar no existe en el sistema');
    }
    
    // Si el usuario es administrador, bloqueamos la eliminación arrojando un error
    if (user.role === 'administrator') {
        throw new Error('Operación denegada: No está permitido eliminar usuarios con rol de administrador');
    }
});

// Método toJSON: se ejecuta automáticamente cada vez que Express/Node serializa el objeto de usuario a formato JSON en la respuesta
UserSchema.methods.toJSON = function () {
    // Convierte el documento de Mongoose a un objeto plano de JavaScript y extrae la contraseña de forma estructurada
    const { password, ...user } = this.toObject();
    // Retorna el objeto del usuario limpio sin la propiedad de contraseña para que nunca se exponga al exterior
    return user;
};

const UserModel = model(
    'user',         // Define el nombre de la colección que almacenará el objeto creado con este Schema
    UserSchema      // Asocia la estructura de datos a la colección
);

export default UserModel;
