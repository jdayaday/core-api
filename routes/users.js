// Required modules
const auth = require('../middleware/auth');             // Authorization middleware
const admin = require('../middleware/admin');           // Administrator middleware
const express = require('express');                     // Express
const Joi = require('joi');                             // Input validation
const router = express.Router();

// Classes
const User = require('../classes/user');
const userObject = new User();

// Return all users
router.get('/', [auth, admin], async (req, res) => {
    const users = await userObject.getUsers();
    res.send(users);
});

// Add new user
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userObject.addUser(
        req.body.username,
        req.body.password,
        req.body.firstname,
        req.body.lastname,
        req.body.address,
        req.body.phone,
        req.body.email,
        req.body.isAdmin
    );

    if(!user) return res.status(400).send('User already registered.');
    
    // Return with JSON web token
    res.header('x-auth-token', await userObject.generateAuthToken(user._id, user.isAdmin)).send(user);
});

// Edit user
router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await userObject.updateUser(
            req.params.id, 
            req.body.username,
            req.body.password,
            req.body.firstname,
            req.body.lastname,
            req.body.address,
            req.body.phone,
            req.body.email,
            req.body.isAdmin
        );
    
        if (!user) return res.status(404).send('The user with the given ID was not found.');
      
        res.send(user);
    } catch(error) {
        return res.status(400).send(error.message);
    }

});

// Delete user
router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await userObject.deleteUser(req.params.id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
});

// Return current user
router.get('/me', auth, async (req, res) => {
    const user = await userObject.getUser(req.user._id);
    
    res.send(user);
});

// Validate user input
function validateUser(user) {
    console.log(user);
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
        email: Joi.string().min(5).max(255).required().email(),
        isAdmin: Joi.boolean().default(false)
    };
  
    return Joi.validate(user, schema);
}

// Export router
module.exports = router;