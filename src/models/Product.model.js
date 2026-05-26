import { model, Schema } from 'mongoose';

// La estructura de datos de la entidad.
const ProductSchema = new Schema({
    name: {
        type: String,       // Regla
        required: true,     // Regla
        minlength: 3,       // Regla
        trim: true          // Modificador
    },
    description: String,
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    stock: {
        type: Number,
        min: 1,
        default: 1
    },
    status: {
        type: Boolean,
        default: true
    }

},{});

// El modelo: Asociacion entre la estructura de datos y la coleccion donde voy a guardar esos datos
const ProductModel = model(
    'product',  // Define el nombre de la collection donde voy a guardar los Documentos
    ProductSchema
);


export default ProductModel;


