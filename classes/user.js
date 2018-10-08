// Required modules
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// Model & Schema
const UserModel = mongoose.model('User', mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    password: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 1024
    },
    firstname: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    lastname: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        zip: {type: Number, required: true}
    },
    phone: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 13
    },
    email: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 255,
        unique: true
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class User {
    constructor() {
        
    }

    getUsers() {
        const users = UserModel.find().sort('username');

        return users;
    }

    getUser(id) {
        // validate ObjectID
        if(!mongoose.Types.ObjectId.isValid(id)) return null;

        const user = UserModel.findById(id);

        return user;
    }

    addUser(username, password, firstname, lastname, address, phone, email) {
        // Check if already registered
        let user = UserModel.findOne({email: email});
        if(user) return null;

        user = new UserModel({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone,
            email: email,
            updated: Date.now()
        });
        
        // Hash the password
        const salt = bcrypt.genSalt(10);
        user.password = bcrypt.hash(user.password, salt);

        user.save();

        // Exclude password field
        return _.pick(user, ['_id', 'username', 'firstname', 'lastname', 'address', 'phone', 'email', 'updated']);
    }

    updateUser(id, username, password, firstname, lastname, address, phone, email) {
        const user = UserModel.findByIdAndUpdate(id, {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone,
            email: email,
            updated: Date.now()
        }, 
        {new: true});

        return user;
    }

    deleteUser(id) {
        const user = UserModel.findByIdAndRemove(id);

        return user;
    }
}

module.exports = User;