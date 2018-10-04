// Required modules
const mongoose = require('mongoose');

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

// Class
class User {
    constructor() {
        
    }

    getUsers() {
        const users = UserModel.find().sort('username');
        return users;
    }

    getUser(id) {
        const user = UserModel.findById(id);
        return user;
    }

    addUser(username, password, firstname, lastname, address, phone, email) {
        let user = new UserModel({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone,
            email: email,
            updated: Date.now()
        });
        user = user.save();
        return user;
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

module.exports = {
    Class: User,
    Model: UserModel
};