// Required modules
const mongoose = require('mongoose');

// Model & Schema
const Item = mongoose.model('Item', mongoose.Schema({
    itemcode: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 16
    },
    description: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    uom: {              // Unit of Measure
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 16
    },
    order_uom: {        // Order UOM
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 16
    },
    uom_conversion: {   // UOM to Order UPM conversion unit
        type: Number,
        required: true
    },
    unit_cost: {        // Unit cost per order UOM
        type: Number,
        required: true
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

class ItemFactory {
    constructor() {
        
    }

    getItems() {
        const items = Item.find().sort('itemcode');
        return items;
    }

    getItem(id) {
        const item = Item.findById(id);
        return item;
    }

    addItem(itemcode, description, uom, order_uom, uom_conversion, unit_cost) {
        let item = new Item({
            itemcode: itemcode,
            description: description,
            uom: uom,
            order_uom: order_uom,
            uom_conversion: uom_conversion,
            unit_cost: unit_cost,
            updated: Date.now()
        });
        item = item.save();
        return item;
    }

    updateItem(id, itemcode, description, uom, order_uom, uom_conversion, unit_cost) {
        const item = Item.findByIdAndUpdate(id, {
            itemcode: itemcode,
            description: description,
            uom: uom,
            order_uom: order_uom,
            uom_conversion: uom_conversion,
            unit_cost: unit_cost,
            updated: Date.now()
        },
        {new: true});
        return item;
    }

    deleteItem(id) {
        const item = Item.findByIdAndRemove(id);
        return item;
    }
}

module.exports = ItemFactory;