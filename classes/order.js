// Required modules
const mongoose = require('mongoose');

const User = require('./user');
const userModel = User.Model;

// Model & Schema
const OrderModel = mongoose.model('Order', mongoose.Schema({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    ordered_by: {
        type: String,
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
class Order {
    constructor() {

    }

    getOrders(userId) {
        // Get orders made by specific user
        const orders = OrderModel.find({
            ordered_by: userId
        }).sort('order_date')
        .populate('item');

        return orders;
    }

    getOrder(id) {
        const order = OrderModel.findById(id);
        return order;
    }

    createOrder(invoice_no, po_no, order_items, ordered_by, status) {
        let order = new OrderModel({
            invoice_no: invoice_no,
            po_no: po_no,
            order_items: order_items,
            ordered_by: ordered_by,
            status: status,
            order_date: Date.now(),
            updated: Date.now()
        });
        order = order.save();
        return order;
    }

    // Update order or set order status to 'commit', 'canceled', or 'fulfilled'
    updateOrder(id, invoice_no, po_no, order_items, ordered_by, status) {
        const order = OrderModel.findByIdAndUpdate(id, {
            invoice_no: invoice_no,
            po_no: po_no,
            order_items: order_items,
            ordered_by: ordered_by,
            status: status,
            updated: Date.now()
        },
        {new: true});
        return order;
    }

    deleteOrder(id) {
        const order = OrderModel.findByIdAndRemove(id);
        return order;
    }
}

module.exports = {
    Class: Order,
    Model: OrderModel
}