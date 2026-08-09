import { model, Schema } from 'mongoose';

// La estructura de datos de la entidad.
const ProductSchema = new Schema({
    referenceCode: {
        type: String,
        required: [true, 'El codigo de referencia del producto es obligatorio'],
        trim: true,
        unique: true
    },
    name: {
        type: String,       // Regla
        required: [true, 'El nombre del producto es obligatorio'],     // Regla
        minlength: [3, 'El nombre del producto debe tener al menos 3 caracteres'],       // Regla
        trim: true,         // Modificador
        unique: true        // Regla
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio no puede ser un valor negativo'],
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es obligatorio'],
        min: [0, 'El stock no puede ser un valor negativo'],
        default: 1
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: [true, 'La categoría del producto es obligatoria']
    },
    // Estructura para el arreglo de imágenes con validadores y mensajes de error personalizados
    images: {
        type: [{
            url: {
                type: String,
                required: [true, 'La URL de la imagen es obligatoria']
            },
            isMain: {
                type: Boolean,
                default: false
            }
        }],
        validate: [
            {
                validator: function (val) {
                    // Restricción máxima de 9 imágenes (permite 0 imágenes al eliminar todas)
                    return Array.isArray(val) && val.length <= 9;
                },
                message: 'No se pueden asociar más de nueve (9) imágenes a un producto'
            }
        ]
    }
}, {
    versionKey: false,
    timestamps: true
});

const ProductModel = model('product', ProductSchema);
export default ProductModel;