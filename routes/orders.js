// Required modules
const auth = require('../middleware/auth'); // Authentication middleware
const express = require('express');         // Express
const Joi = require('joi');                 // Input validation
const router = express.Router();

// Classes
const Order = require('../classes/order');
const orderObject = new Order();

// Return all user orders
router.get('/', auth, async (req, res) => {
    const orders = await orderObject.getOrders(req.query);
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
        req.body.ordered_by,
        req.body.status
    );

    if(!order) return res.status(400).send('Order already exists.');
    
    res.send(order);
});

// Edit order
router.put('/:id', auth, async (req, res) => {
    const { error } = validateOrder(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const order = await orderObject.updateOrder(
            req.params.id, 
            req.body.invoice_no,
            req.body.po_no,
            req.body.order_items,
            req.body.ordered_by,
            req.body.status
        );
    
        if (!order) return res.status(404).send('The order with the given ID was not found.');
      
        res.send(order);
    } catch(error) {
        return res.status(400).send(error.message);
    }

});

// Delete order
router.delete('/:id', auth, async (req, res) => {
    const order = await orderObject.deleteOrder(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');
  
    res.send(order);
});

// Return specified order
router.get('/:id', auth, async (req, res) => {
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

// Export router
module.exports = router;