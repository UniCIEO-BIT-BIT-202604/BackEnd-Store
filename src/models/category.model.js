import { Schema, model } from "mongoose";


const CategorySchema = new Schema({
    name : {
        type : String,
        required : true,
        
    },
    description : {
        type  :String,
        trim : true,
        default : ''
    },

    urlImage : {
        type : String,
        default : ''
    },

    status : {
        type : Boolean,
        default  : true
    },

    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: 'user'
    }
},{
    versionKey : false,
    timestamps : true
});



const categoryModel = model(
    'category',
    CategorySchema

);

export default categoryModel;
