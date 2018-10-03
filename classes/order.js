// Required modules
const mongoose = require('mongoose');

const User = require('./user');
const userModel = User.Model;

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
        enum: ['pending', 'commit', 'canceled', 'fulfilled'],
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

    getOrders(userId) {
        // Get orders made by specific user
        const user = userModel.findById(userId);
        const orders = Order.find({
            ordered_by: user._id
        }).sort('order_date');
    }

    createOrder(invoice_no, po_no, order_items, ordered_by, status, order_date) {
        let order = new Order({
            invoice_no: invoice_no,
            po_no: po_no,
            order_items: order_items,
            ordered_by: ordered_by,
            status: status,
            order_date: order_date,
            updated: Date.now()
        });
        order
    }

    updateOrder() {

    }

    cancelOrder() {

    }

    deleteOrder() {

    }
}