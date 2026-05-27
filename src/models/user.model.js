import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    nickname: {
        type: String,
        required: [true, 'El nickname es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
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
