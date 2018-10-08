// Required modules
const express = require('express');     // Express
const Joi = require('joi');             // Input validation
const router = express.Router();

// Classes
const Auth = require('../classes/auth');
const authObject = new Auth();

// Authenticate user
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const authenticated = await authObject.authenticateUser(
        req.body.email,
        req.body.password
    );

    if(!user) return res.status(400).send('Invalid user or password.');
    
    res.send(user);
});

// Validate user input
function validateUser(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
}

// Export router
module.exports = router;