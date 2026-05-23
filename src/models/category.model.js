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

    Image : {
        type : String,
        default : ''
    },

    status : {
        type : Boolean,
        default  : true
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
