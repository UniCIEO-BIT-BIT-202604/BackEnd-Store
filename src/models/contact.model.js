import { Schema, model } from "mongoose";

const ContactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El contacto debe estar asociado a un usuario']
    },
    label: {
        type: String,
        required: [true, 'La etiqueta es obligatoria (ej. Casa, Trabajo, Novia)'],
        trim: true,
        maxlength: [30, 'La etiqueta no puede exceder los 30 caracteres']
    },
    receiverName: {
        type: String,
        required: [true, 'El nombre de quien recibe es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },
    address: {
        type: String,
        required: [true, 'La dirección de entrega es obligatoria'],
        trim: true,
        minlength: [5, 'La dirección debe tener al menos 5 caracteres']
    },
    phone: {
        type: String,
        required: [true, 'El teléfono de contacto es obligatorio'],
        trim: true,
        match: [/^[+0-9\s-]+$/, 'El teléfono solo puede contener números, espacios y guiones']
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

const ContactModel = model('contact', ContactSchema);

export default ContactModel;
