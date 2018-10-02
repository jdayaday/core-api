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
}