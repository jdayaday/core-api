// Required modules
const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    
    // Check if web token provided
    if(!token) return res.status(401).send('Access Denied. No token provided.');

    // Validate token
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;

        // Pass to the next middleware
        next();
    } catch(error) {
        res.status(400).send('Invalid token.');
    }
}