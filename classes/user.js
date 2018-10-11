// Required modules
const config = require('config');
const jwt = require('jsonwebtoken');
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
    isAdmin: Boolean,
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class User {

    async getUsers() {
        const users = await UserModel.find().sort('username');

        return _.map(users, _.partialRight(_.pick, [
            '_id', 
            'username', 
            'firstname', 
            'lastname', 
            'address', 
            'phone', 
            'email', 
            'updated'
        ]));
    }

    async getUser(id) {
        // validate ObjectID
        if(!mongoose.Types.ObjectId.isValid(id)) return null;

        const user = await UserModel.findById(id);

        // Exclude uneccessary fields
        return _.pick(user, [
            '_id', 
            'username', 
            'firstname', 
            'lastname', 
            'address', 
            'phone', 
            'email', 
            'updated'
        ]);
    }

    async addUser(username, password, firstname, lastname, address, phone, email, isAdmin) {
        // Check if already registered
        let user = await UserModel.findOne({email: email});
        if(user) return null;

        // Create new user
        user = new UserModel({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone,
            email: email,
            isAdmin: isAdmin,
            updated: Date.now()
        });
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        // Exclude uneccessary fields
        return _.pick(user, [
            '_id', 
            'username', 
            'firstname', 
            'lastname', 
            'address', 
            'phone', 
            'email', 
            'updated'
        ]);
    }

    async updateUser(id, username, password, firstname, lastname, address, phone, email, isAdmin) {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        
        const user = await UserModel.findByIdAndUpdate(id, {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone,
            email: email,
            isAdmin: isAdmin,
            updated: Date.now()
        },
        {new: true});

        // Exclude uneccessary fields
        return _.pick(user, [
            '_id', 
            'username', 
            'firstname', 
            'lastname', 
            'address', 
            'phone', 
            'email', 
            'updated'
        ]);
    }

    async deleteUser(id) {
        const user = await UserModel.findByIdAndRemove(id);

        // Exclude uneccessary fields
        return _.pick(user, [
            '_id', 
            'username', 
            'firstname', 
            'lastname', 
            'address', 
            'phone', 
            'email', 
            'updated'
        ]);
    }

    async generateAuthToken(id, isAdmin) {
        return jwt.sign({_id: id, isAdmin: isAdmin}, config.get('jwtPrivateKey'));
    }

    async authenticateUser(email, password) {
        // Lookup user's email address
        let user = await UserModel.findOne({email: email});
        
        if(!user) return null;

        // Compare password
        const validPassword = bcrypt.compare(password, user.password);

        // Sign
        if(validPassword)
        return await this.generateAuthToken(user._id, user.isAdmin);
        
        return null;
    }
}

module.exports = User;