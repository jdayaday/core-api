// Requiered modules
const mongoose = require('mongoose');

// Model & Schema
const User = mongoose.model('User', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 20
    }
}));

class UserFactory {
    constructor() {
        
    }

    getUsers() {
        const users = User.find().sort('name');
        return users;
    }

    getUser(id) {
        const user = User.findById(id);
        return user;
    }

    addUser(name) {
        let user = new User({name: name});
        user = user.save();
        return user;
    }

    updateUser(id, name) {
        const user = User.findByIdAndUpdate(id, {name: name}, {new: true});
        return user;
    }

    deleteUser(id) {
        const user = User.findByIdAndRemove(id);
        return user;
    }
}

module.exports = UserFactory;