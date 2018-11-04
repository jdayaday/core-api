// Required modules
const validateObjectId = require('../middleware/validateObjectId'); // Validate Object ID middlewareconst auth = require('../middleware/auth');             // Authorization middleware
const auth = require('../middleware/auth');                         // Authorization middleware
const admin = require('../middleware/admin');                       // Administrator middleware
const express = require('express');                                 // Express
const Joi = require('joi');                                         // Input validation
const router = express.Router();

// Classes
const Item = require('../classes/item').class;
const itemObject = new Item();

// Return all items
router.get('/', auth, async (req, res) => {
    const items = await itemObject.getItems();
    res.send(items);
});

// Add new item
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateItem(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const item = await itemObject.addItem(
        req.body.itemcode,
        req.body.description,
        req.body.uom,
        req.body.order_uom,
        req.body.uom_conversion,
        req.body.unit_cost,
        req.user._id
    );
    
    if(!item) return res.status(400).send('Item already exists.');

    res.send(item);
});

// Edit item
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const { error } = validateItem(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const item = await itemObject.updateItem(
            req.params.id,
            req.body.itemcode,
            req.body.description,
            req.body.uom,
            req.body.order_uom,
            req.body.uom_conversion,
            req.body.unit_cost,
            req.user._id
        );
    
        if (!item) return res.status(404).send('The item with the given ID was not found.');
      
        res.send(item);
    } catch(error) {
        return res.status(400).send(error.message);
    }
});

// Delete item
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const item = await itemObject.deleteItem(req.params.id);

    if (!item) return res.status(404).send('The item with the given ID was not found.');
  
    res.send(item);
});

// Return specified item
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const item = await itemObject.getItem(req.params.id);

    if (!item) return res.status(404).send('The item with the given ID was not found.');

    res.send(item);
});

// Validate user input
function validateItem(item) {
    const schema = {
      itemcode: Joi.string().min(1).max(16).required(),
      description: Joi.string().min(1).max(50).required(),
      uom: Joi.string().min(1).max(16).required(),
      order_uom: Joi.string().min(1).max(16).required(),
      uom_conversion: Joi.number().required(),
      unit_cost: Joi.number().required(),
    };
  
    return Joi.validate(item, schema);
}

// Export router
module.exports = router;