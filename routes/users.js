// Required modules
const express = require('express');     // Express
const Joi = require('joi');             // Input validation
const router = express.Router();

// Classes
const User = require('../classes/user');
const userObject = new User();

// Return all users
router.get('/', async (req, res) => {
    const users = await userObject.getUsers();
    res.send(users);
});

// Add new user
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userObject.addUser(
        req.body.username,
        req.body.password,
        req.body.firstname,
        req.body.lastname,
        req.body.address,
        req.body.phone,
        req.body.email
    );

    if(!user) return res.status(400).send('User already registered.');
    
    res.send(user);
});

// Edit user
router.put('/:id', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userObject.updateUser(
        req.params.id, 
        req.body.username,
        req.body.password,
        req.body.firstname,
        req.body.lastname,
        req.body.address,
        req.body.phone,
        req.body.email
    );

    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
});

// Delete user
router.delete('/:id', async (req, res) => {
    const user = await userObject.deleteUser(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
});

// Return specified user
router.get('/:id', async (req, res) => {
    const user = await userObject.getUser(req.params.id);
    
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

// Validate user input
function validateUser(user) {
    const schema = {
        username: Joi.string().min(1).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
        firstname: Joi.string().min(1).max(50).required(),
        lastname: Joi.string().min(1).max(50).required(),
        address: {
            street: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().required(),
            zip: Joi.number().required(),
        },
        phone: Joi.string().min(1).max(13).required(),
        email: Joi.string().min(5).max(255).required().email()
    };
  
    return Joi.validate(user, schema);
}

// Export router
module.exports = router;