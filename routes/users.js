// Required modules
const express = require('express');     // Express
const Joi = require('joi');             // Input validation
const router = express.Router();

// Classes
const Factory = require('../classes/user_factory');
const userfactory = new Factory();

// Return all users
router.get('/', async (req, res) => {
    const users = await userfactory.getUsers();
    res.send(users);
});

// Add new user
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userfactory.addUser(req.body.name);
    
    res.send(user);
});

// Edit user
router.put('/:id', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userfactory.updateUser(req.params.id, req.body.name);

    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
});

// Delete user
router.delete('/:id', async (req, res) => {
    const user = await userfactory.deleteUser(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
});

// Return specified user
router.get('/:id', async (req, res) => {
    const user = await userfactory.getUser(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

// Validate user input
function validateUser(user) {
    const schema = {
      name: Joi.string().min(3).required()
    };
  
    return Joi.validate(user, schema);
}

// Export router
module.exports = router;