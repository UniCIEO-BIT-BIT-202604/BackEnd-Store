import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
    ownerUserId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

const ReviewModel = model("reviews", ReviewSchema);


export default ReviewModel;

