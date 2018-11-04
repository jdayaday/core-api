// Required modules
const validateObjectId = require('../middleware/validateObjectId'); // Validate Object ID middleware
const auth = require('../middleware/auth');                         // Authorization middleware
const express = require('express');                                 // Express
const Joi = require('joi');                                         // Input validation
const router = express.Router();

// Classes
const Order = require('../classes/order').class;
const orderObject = new Order();

// Return all user orders
router.get('/', auth, async (req, res) => {
    let orders = {};

    if(req.user.isAdmin) {
        // Admin will have access to all orders
        orders = await orderObject.getOrders(req.query);
    } else {
        // Query only orders made by the user
        req.query.ordered_by = req.user._id;
        orders = await orderObject.getOrders(req.query);
    }

    res.send(orders);
});

// Create new order
router.post('/', auth, async (req, res) => {
    const { error } = validateOrder(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const order = await orderObject.createOrder(
        req.body.invoice_no,
        req.body.po_no,
        req.body.order_items,
        req.user._id,           // Current user _id will be used
        req.body.status,
        req.user, _id
    );

    if(!order) return res.status(400).send('Order already exists.');
    
    res.send(order);
});

// Edit order
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateOrder(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user has access to edit the order
    if(!validateUserAccess(req)) {
        return res.status(401).send('Access Denied. Not allowed to edit order.');
    }

    try {
        const order = await orderObject.updateOrder(
            req.params.id,
            req.body.invoice_no,
            req.body.po_no,
            req.body.order_items,
            req.body.ordered_by,
            req.body.status,
            req.user._id
        );
    
        if (!order) return res.status(404).send('The order with the given ID was not found.');
      
        res.send(order);
    } catch(error) {
        return res.status(400).send(error.message);
    }

});

// Delete order
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    // Check if user has access to delete the order
    if(!validateUserAccess(req)) {
        return res.status(401).send('Access Denied. Not allowed to delete order.');
    }

    const order = await orderObject.deleteOrder(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');
  
    res.send(order);
});

// Return specified order
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    // Check if user has access to the order
    if(!validateUserAccess(req)) {
        return res.status(401).send('Access Denied. Not allowed to view the order.');
    }

    const order = await orderObject.getOrder(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');

    res.send(order);
});

// Validate user input
function validateOrder(order) {
    const schema = {
        invoice_no: Joi.string().min(1).required(),
        po_no: Joi.string().min(1).required(),
        order_items: Joi.array().items({
            item: Joi.objectId().required(),
            quantity: Joi.number().required()
        }),
        ordered_by: Joi.string().min(1).required(),
        status: Joi.string().valid('pending', 'commit', 'canceled', 'fulfilled').required()
    };

    return Joi.validate(order, schema);
}

// Validate if user has access to data/resource
async function validateUserAccess(req, res) {
    // Check if user has access to edit the order
    if(!req.user.isAdmin) {
        const order = await orderObject.getOrder(req.params.id);
        if(order.ordered_by != req.user._id) {
            return false;
        }
    }

    return true;
}

// Export router
module.exports = router;