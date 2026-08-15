import { Schema, model } from 'mongoose';
import CartItemSchema from './cart-item.schema.js';

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El ID del usuario es obligatorio'],
        unique: true
    },
    items: [CartItemSchema]
}, {
    versionKey: false,
    timestamps: true
});

const CartModel = model('cart', CartSchema);


export default CartModel;
export { CartSchema };
