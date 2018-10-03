// Required modules
const mongoose = require('mongoose');

// Model & Schema
const Order = mongoose.model('Order', mongoose.Schema({
    invoice_no: {
        type: String,
        required: true
    },
    po_no: {
        type: String,
        required: true
    },
    order_items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    ordered_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'commit'],
        default: 'pending',
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class OrderFactory {
    constructor() {

    }

    getOrders(user) {

    }
}