// Required modules
const Joi = require('joi'); // Input validatation

module.exports = function() {
    Joi.objectId = require('joi-objectid')(Joi);    // ObjectID validation for Joi
}