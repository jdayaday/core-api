// Required modules
const express = require('express');     // Express
const Joi = require('joi');             // Input validation
const router = express.Router();

// Classes
const User = require('../classes/user');
const userObject = new User();

// Authenticate user
router.post('/', async (req, res) => {
    const { error } = validateUserCredentials(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const authenticated = await userObject.authenticateUser(
        req.body.email,
        req.body.password
    );

    if(!authenticated) return res.status(400).send('Invalid user or password.');
    
    res.send(authenticated);
});

// Validate user input
function validateUserCredentials(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
}

// Export router
module.exports = router;