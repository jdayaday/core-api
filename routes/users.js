const express = require('express');     // Express
const Joi = require('joi');             // Input validation
const router = express.Router();

// Sample data
const users = [
    { id: 1, name: 'Jonathan' },
    { id: 2, name: 'John' }, 
    { id: 3, name: 'Jon' },
  ];

// Return all users
router.get('/', (req, res) => {
    res.send(users);
});

// Add new user
router.post('/', (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(user);
    res.send(user);
});

// Edit user
router.put('/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    user.name = req.body.name; 
    res.send(user);
});

// Delete user
router.delete('/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    const index = users.indexOf(user);
    users.splice(index, 1);
  
    res.send(user);
});

// Return specified user
router.get('/:id', (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
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