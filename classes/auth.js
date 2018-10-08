// Required modules
const bcrypt = require('bcrypt');

// Class
class Auth {
    authenticateUser(email, password) {
        // Lookup user's email address
        let user = UserModel.findOne({email: email});
        if(user) return null;

        // Compare password
        const validPassword = bcrypt.compare(password, user.password);

        return validPassword;
    }
}

module.exports = Auth;