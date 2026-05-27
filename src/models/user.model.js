import { Schema, model } from "mongoose";

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
    .set(function(value) {
        this._confirmPassword = value;
    })
    .get(function() {
        return this._confirmPassword;
    });

// Hook de pre-validación para asegurar que las contraseñas coincidan
UserSchema.pre('validate', function(next) {
    if (this.isModified('password')) {
        if (!this.confirmPassword) {
            this.invalidate('confirmPassword', 'Debes confirmar la contraseña');
        } else if (this.password !== this.confirmPassword) {
            this.invalidate('confirmPassword', 'Las contraseñas no coinciden');
        }
    }
    next();
});

// Método para excluir la contraseña cuando se retorne el objeto de usuario en las respuestas JSON
UserSchema.methods.toJSON = function() {
    const { password, ...user } = this.toObject();
    return user;
};

const UserModel = model(
    'user',         // Define el nombre de la colección que almacenará el objeto creado con este Schema
    UserSchema      // Asocia la estructura de datos a la colección
);

export default UserModel;
