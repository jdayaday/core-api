// Required modules
const mongoose = require('mongoose');

// Model & Schema
const OrderModel = mongoose.model('Order', mongoose.Schema({
    invoice_no: {
        type: String,
        required: true,
        unique: true
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
    async getOrders(query) {
        // Get orders
        const orders = await OrderModel.find(query)
        .populate('order_items.item')
        .sort('order_date');

        return orders;
    }

    async getOrder(id) {
        if(!mongoose.Types.ObjectId.isValid(id)) return null;

        const order = await OrderModel.findById(id);
        
        return order;
    }

    async createOrder(invoice_no, po_no, order_items, ordered_by, status) {
        // Check if order is already existing
        let order = await ItemModel.findOne({invoice_no: invoice_no});
        if(order) return null;

        order = new OrderModel({
            invoice_no: invoice_no,
            po_no: po_no,
            order_items: this.consolidate(order_items),
            ordered_by: ordered_by,
            status: status,
            order_date: Date.now(),
            updated: Date.now()
        });
        await order.save();

        return order;
    }

    // Update order or set order status to 'commit', 'canceled', or 'fulfilled'
    async updateOrder(id, invoice_no, po_no, order_items, ordered_by, status) {
        const order = await OrderModel.findByIdAndUpdate(id, {
            invoice_no: invoice_no,
            po_no: po_no,
            order_items: this.consolidate(order_items),
            ordered_by: ordered_by,
            status: status,
            updated: Date.now()
        },
        {new: true});

        return order;
    }

    async deleteOrder(id) {
        const order = await OrderModel.findByIdAndRemove(id);
        return order;
    }

    // Helper methods
    consolidate(orders) {
        var consolidated = [];
        var order_keys = Object.keys(orders);
        order_keys.forEach(order_key => {
            var order = orders[order_key];
            var consolidated_keys = Object.keys(consolidated);
            if(consolidated_keys.length != 0) { // Check if list is empty
                let found = false;
                consolidated_keys.forEach(consolidated_key => {
                    var consolidated_item = consolidated[consolidated_key];
                    if(order.item === consolidated_item.item) {
                        consolidated_item.quantity += order.quantity;
                        found = true;
                    }
                });
                if(!found) { // Found matching order
                    consolidated.push(order);
                }
            } else { // Empty list
                consolidated.push(order);
            }
        });
        return consolidated;
    }
}

module.exports = Order;