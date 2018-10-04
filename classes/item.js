// Required modules
const mongoose = require('mongoose');

// Model & Schema
const ItemModel = mongoose.model('Item', mongoose.Schema({
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

// Class
class Item {
    constructor() {
        
    }

    getItems() {
        const items = ItemModel.find().sort('itemcode');
        return items;
    }

    getItem(id) {
        const item = ItemModel.findById(id);
        return item;
    }

    addItem(itemcode, description, uom, order_uom, uom_conversion, unit_cost) {
        let item = new ItemModel({
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
        const item = ItemModel.findByIdAndUpdate(id, {
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
        const item = ItemModel.findByIdAndRemove(id);
        return item;
    }
}

module.exports = {
    Class: Item,
    Model: ItemModel
}