// Required modules
const mongoose = require('mongoose');

// Model & Schema
const VendorModel = mongoose.model('Vendor', mongoose.Schema({
    vendor_code: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 16,
        unique: true
    },
    vendor_name: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    contact_name: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    email: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 255,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 13
    },
    fax: {
        type: String,
        minlenght: 1,
        maxlenght: 13
    },
    address: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 255,
    },
    vendor_items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        lead_time_in_days: {
            type: Number,
            required: true
        }
    }],
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class Vendor {
    async getVendors() {
        const vendors = await VendorModel.find().sort(vendor_code);

        return vendors;
    }

    async getVendor(id) {
        // validate ObjectID
        if(!mongoose.Types.ObjectId.isValid(id)) return null;

        const vendor = await VendorModel.findById(id);

        return vendor;
    }

    async addVendor(vendor_code, vendor_name, contact_name, email, phone, fax, address, vendor_items) {
        // Check if item is already existing
        let vendor = await VendorModel.findOne({vendor_code: vendor_code});
        if(vendor) return null;

        vendor = new VendorModel({
            vendor_code: vendor_code,
            vendor_name: vendor_name,
            contact_name: contact_name,
            email: email,
            phone: phone,
            fax: fax,
            address: address,
            vendor_items, vendor_items,
            updated: Date.now()
        });

        await vendor.save();

        return vendor;
    }

    async updateVendor(id, vendor_code, vendor_name, contact_name, email, phone, fax, address, vendor_items) {
        const vendor = await VendorModel.findByIdAndUpdate(id, {
            vendor_code: vendor_code,
            vendor_name: vendor_name,
            contact_name: contact_name,
            email: email,
            phone: phone,
            fax: fax,
            address: address,
            vendor_items, vendor_items,
            updated: Date.now()
        },
        {new: true});

        return vendor;
    }

    async deleteVendor(id) {
        const vendor = await VendorModel.findByIdAndRemove(id);
        
        return vendor;
    }
}

module.exports = Vendor;