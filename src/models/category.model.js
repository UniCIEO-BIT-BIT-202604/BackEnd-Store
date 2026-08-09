import { Schema, model } from "mongoose";


const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'EL nombre de la categoria es obligatoria'],
        unique: true,
        minlength: [5, 'El nombre de la categoria tener al menos 5 caracteres'],
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'EL slug de la categoria es obligatorio'],
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    urlImage: {
        type: String,
        default: '/uploads/categories/default-category.png'
    },

    status: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    versionKey: false,
    timestamps: true
});



const categoryModel = model(
    'category',
    CategorySchema

);

export default categoryModel;
