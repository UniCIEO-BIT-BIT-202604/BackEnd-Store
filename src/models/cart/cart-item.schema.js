import { Schema } from 'mongoose';

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'El ID del producto es obligatorio']
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad del producto es obligatoria'],
        min: [1, 'La cantidad mínima debe ser al menos 1'],
        default: 1
    }
}, { _id: false });

export default CartItemSchema;
