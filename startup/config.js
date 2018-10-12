// Required modules
const config = require('config');   // Configurations - set NODE_ENV environment variable

module.exports = function() {
    // Check if JWT private key is set
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}