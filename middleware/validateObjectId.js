// Dependecies
const mongoose = require('mongoose');       // Mongoose

module.exports = function(req, res, next) {
    // Validate object ID
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid ID');
    }

    next();
};