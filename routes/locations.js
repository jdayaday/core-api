// Required modules
const validateObjectId = require('../middleware/validateObjectId'); // Validate Object ID middlewareconst auth = require('../middleware/auth');             // Authorization middleware
const auth = require('../middleware/auth');                         // Authorization middleware
const admin = require('../middleware/admin');                       // Administrator middleware
const express = require('express');                                 // Express
const Joi = require('joi');                                         // Input validation
const router = express.Router();

// Classes
const Location = require('../classes/location').class;
const locationObject = new Location();

// Return all locations
router.get('/', auth, async (req, res) => {
    const locations = await locationObject.getLocations();
    res.send(locations);
});

// Add new location
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateLocation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const location = await locationObject.addLocation(
        req.body.location_code,
        req.body.description,
        req.body.area,
        req.body.shelf_bin,
        req.user._id
    );
    
    if(!location) return res.status(400).send('Location already exists.');

    res.send(location);
});

// Edit location
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const { error } = validateLocation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const location = await locationObject.updateLocation(
            req.params.id,
            req.body.location_code,
            req.body.description,
            req.body.area,
            req.body.shelf_bin,
            req.user._id
        );
    
        if (!location) return res.status(404).send('The location with the given ID was not found.');
      
        res.send(location);
    } catch(error) {
        return res.status(400).send(error.message);
    }
});

// Delete location
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const location = await locationObject.deleteLocation(req.params.id);

    if (!location) return res.status(404).send('The location with the given ID was not found.');
  
    res.send(location);
});

// Return specified location
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const location = await locationObject.getLocation(req.params.id);

    if (!location) return res.status(404).send('The locaiton with the given ID was not found.');

    res.send(location);
});

// Validate user input
function validateLocation(location) {
    const schema = {
        location_code: Joi.string().min(1).max(16).required(),
        description: Joi.string().min(1).max(255),
        area: Joi.string().min(1).max(50).required(),
        shelf_bin: Joi.string().min(1).max(50).required()
    };
  
    return Joi.validate(location, schema);
}

// Export router
module.exports = router;