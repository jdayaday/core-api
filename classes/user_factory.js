// Required modules
const mongoose = require('mongoose');

// Model & Schema
const User = mongoose.model('User', mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
    },
    password: {
        type: String,
        required: true,
        minlenght: 1,
        maxlenght: 50
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
        minlenght: 1,
        maxlenght: 100
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

class UserFactory {
    constructor() {
        
    }

    getUsers() {
        const users = User.find().sort('username');
        return users;
    }

    getUser(id) {
        const user = User.findById(id);
        return user;
    }

    addUser(username, password, firstname, lastname, address, phone, email) {
        let user = new User({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone,
            email: email
        });
        user = user.save();
        return user;
    }

    updateUser(id, username, password, firstname, lastname, address, phone, email) {
        const user = User.findByIdAndUpdate(id, {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone,
            email: email
        }, 
        {new: true});
        return user;
    }

    deleteUser(id) {
        const user = User.findByIdAndRemove(id);
        return user;
    }
}

module.exports = UserFactory;