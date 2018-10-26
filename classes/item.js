// Required modules
const mongoose = require('mongoose');

// Model & Schema
const ItemModel = mongoose.model('Item', mongoose.Schema({
    itemcode: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 16,
        unique: true
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
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class Item {
    async getItems() {
        const items = await ItemModel.find().sort('itemcode');

        return items;
    }

    async getItem(id) {
        // validate ObjectID
        if(!mongoose.Types.ObjectId.isValid(id)) return null;

        const item = await ItemModel.findById(id);

        return item;
    }

    async addItem(itemcode, description, uom, order_uom, uom_conversion, unit_cost, updated_by) {
        // Check if item is already existing
        let item = await ItemModel.findOne({itemcode: itemcode});
        if(item) return null;

        item = new ItemModel({
            itemcode: itemcode,
            description: description,
            uom: uom,
            order_uom: order_uom,
            uom_conversion: uom_conversion,
            unit_cost: unit_cost,
            updated_by: updated_by,
            updated: Date.now()
        });
        
        await item.save();

        return item;
    }

    async updateItem(id, itemcode, description, uom, order_uom, uom_conversion, unit_cost, updated_by) {
        const item = await ItemModel.findByIdAndUpdate(id, {
            itemcode: itemcode,
            description: description,
            uom: uom,
            order_uom: order_uom,
            uom_conversion: uom_conversion,
            unit_cost: unit_cost,
            updated_by: updated_by,
            updated: Date.now()
        },
        {new: true});

        return item;
    }

    async deleteItem(id) {
        const item = await ItemModel.findByIdAndRemove(id);
        
        return item;
    }
}

module.exports = Item;