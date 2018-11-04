// Required modules
const validateObjectId = require('../middleware/validateObjectId'); // Validate Object ID middleware
const auth = require('../middleware/auth');                         // Authorization middleware
const admin = require('../middleware/admin');                       // Administrator middleware
const express = require('express');                                 // Express
const Joi = require('joi');                                         // Input validation
const router = express.Router();

// Classes
const Vendor = require('../classes/vendor').class;
const vendorObject = new Vendor();

// Return all vendors
router.get('/', auth, async (req, res) => {
    const vendors = await vendorObject.getVendors();
    res.send(vendors);
});

// Add new vendor
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateVendor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const vendor = await vendorObject.addVendor(
        req.body.vendor_code,
        req.body.vendor_name,
        req.body.contact_name,
        req.body.email,
        req.body.phone,
        req.body.fax,
        req.body.address,
        req.body.vendor_items,
        req.user._id
    );
    
    if(!vendor) return res.status(400).send('Vendor already exists.');

    res.send(vendor);
});

// Edit vendor
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const { error } = validateVendor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const vendor = await vendorObject.updateVendor(
            req.params.id,
            req.body.vendor_code,
            req.body.vendor_name,
            req.body.contact_name,
            req.body.email,
            req.body.phone,
            req.body.fax,
            req.body.address,
            req.body.vendor_items,
            req.user._id
        );
    
        if (!vendor) return res.status(404).send('The vendor with the given ID was not found.');
      
        res.send(vendor);
    } catch(error) {
        return res.status(400).send(error.message);
    }
});

// Delete vendor
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const vendor = await vendorObject.deleteVendor(req.params.id);

    if (!vendor) return res.status(404).send('The vendor with the given ID was not found.');
  
    res.send(vendor);
});

// Return specified vendor
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const vendor = await vendorObject.getVendor(req.params.id);

    if (!vendor) return res.status(404).send('The vendor with the given ID was not found.');

    res.send(vendor);
});


// Validate user input
function validateVendor(vendor) {
    const schema = {
        vendor_code: Joi.string().min(1).max(16).required(),
        vendor_name: Joi.string().min(1).max(50).required(),
        contact_name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(255).required(),
        phone: Joi.string().min(1).max(13).required(),
        fax: Joi.string().min(1).max(13),
        address: Joi.string().min(1).max(255).required(),
        vendor_items: Joi.array().items({
            item: Joi.objectId().required(),
            cost: Joi.number().required(),
            lead_time_in_days: Joi.number().required()
        }),
    };
  
    return Joi.validate(vendor, schema);
}

// Export router
module.exports = router;