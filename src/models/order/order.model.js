import { Schema, model } from 'mongoose';
import OrderItemSchema from './order-item.schema.js';

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El ID del usuario es obligatorio']
    },
    items: {
        type: [OrderItemSchema],
        validate: [
            {
                validator: function (val) {
                    return Array.isArray(val) && val.length > 0;
                },
                message: 'Una orden debe contener al menos un producto'
            }
        ]
    },
    shippingAddress: {
        address: {
            type: String,
            required: [true, 'La dirección de envío es obligatoria'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'La ciudad de envío es obligatoria'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'El teléfono de contacto es obligatorio'],
            trim: true
        },
        notes: {
            type: String,
            trim: true,
            default: ''
        }
    },
    totalAmount: {
        type: Number,
        required: [true, 'El monto total es obligatorio'],
        min: [0, 'El monto total no puede ser negativo']
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PAID'
    },
    paymentMethod: {
        type: String,
        enum: ['MOCK_CARD', 'CASH_ON_DELIVERY', 'WOMPI', 'PAYPAL'],
        default: 'MOCK_CARD'
    },
    transactionId: {
        type: String,
        trim: true,
        default: function () {
            return `TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

const OrderModel = model('order', OrderSchema);
export default OrderModel;
export { OrderSchema };
