// Required modules
const mongoose = require('mongoose');

// Model & Schema
const ItemLedgerModel = mongoose.model('ItemLedger', mongoose.Schema({
    item_ledger_entry_no: {
        type: String,
        required: true,
        unique: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    quantity: {
        type: Number,
        default: 1
    },
    posted_by: {
        type: String,
        ref: 'User'
    },
    entry_type: {
        type: String,
        enum: ['purchase', 'sale', 'transfer', 'waste'],
        default: 'pending',
        required: true
    },
    posting_date: {
        type: Date,
        default: Date.now
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class ItemLedger {
    async getLedgerEntries(query) {
        // Get item ledger entries
        const entries = await ItemLedgerModel.find(query)
        .populate('item')
        .sort('posting_date');

        return entries;
    }

    async postEntry(item_ledger_entry_no, item, quantity, posted_by, entry_type) {
        // Check if the item ledger entry already exists
        let entry = await ItemLedgerModel.findOne({item_ledger_entry_no: item_ledger_entry_no});
        if(entry) return null;

        entry = new ItemLedgerModel({
            item_ledger_entry_no: item_ledger_entry_no,
            item: item,
            quantity: quantity,
            posted_by: posted_by,
            entry_type: entry_type
        });

        await entry.save();

        return entry;
    }

}

module.exports = ItemLedger;