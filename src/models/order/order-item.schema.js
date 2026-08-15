import { Schema } from 'mongoose';

const OrderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'El ID del producto es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'El precio histórico del producto es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad comprada es obligatoria'],
        min: [1, 'La cantidad mínima comprada debe ser al menos 1']
    }
}, { _id: false });

export default OrderItemSchema;
