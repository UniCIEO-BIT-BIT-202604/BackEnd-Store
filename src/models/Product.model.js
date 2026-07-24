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
    description: String,
    price: {
        type: Number,
        min: [0, 'El precio no puede ser menor que cero'],
        default: 0
    },
    stock: {
        type: Number,
        min: [1, 'Se requiere registrar minimo una unidad'],
        default: 1
    },
    // Crea una asociacion con el modelo de categoria usando el ID de cualquiera de sus documentos registrados
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        //required: [ true, 'Debe seleccionar el ID de una categoria' ]
    },
    status: {
        type: Boolean,
        default: true
    },
    // Crea una asociancion con el modelo de usuarios usando el ID para registrar el usuario que crea el producto
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }

}, {
    versionKey: false,
    timestamps: true    // createdAt/updatedAt
});

// El modelo: Asociacion entre la estructura de datos y la coleccion donde voy a guardar esos datos
const ProductModel = model(
    'product',  // Define el nombre de la collection donde voy a guardar los Documentos
    ProductSchema
);


export default ProductModel;


