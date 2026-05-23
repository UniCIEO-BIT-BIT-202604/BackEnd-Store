import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        // minLength: 12,
        trim: true
    },

    
    description: String,
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    stock: {
        type: Number,
        default: 1,
        min: 1
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    versionKey: false,
    timestamps: true
});



const ProductModel = model( 
    'product',          // Define el nombre de la coleccion que almacenara el objeto creado con este Schema 
    ProductSchema       // Asocia la estructura de datos 2a la coleccion 
);


export default ProductModel;

