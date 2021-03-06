// Required modules
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const pick_fields = [
    '_id',
    'username',
    'firstname',
    'lastname',
    'address',
    'phone',
    'email',
    'updated_by',
    'updated'
];

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
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated: {          // Update date
        type: Date,
        default: Date.now
    }
}));

// Class
class User {
    constructor() {
        // Lookup admin user
        UserModel.findOne({username: 'admin'}).then( async (user) => {
            // Create admin user if not existing
            if(!user) await this.createAdminUser();
        });
    }

    async getUsers() {
        const users = await UserModel.find().sort('username');

        return _.map(users, _.partialRight(_.pick, pick_fields));
    }

    async getUser(id) {
        // validate ObjectID
        if(!mongoose.Types.ObjectId.isValid(id)) return null;

        const user = await UserModel.findById(id);

        // Exclude uneccessary fields
        return _.pick(user, pick_fields);
    }

    async addUser(username, password, firstname, lastname, address, phone, email, isAdmin, updated_by) {
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
            updated_by: updated_by,
            updated: Date.now()
        });
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        // Exclude uneccessary fields
        return _.pick(user, pick_fields);
    }

    async updateUser(id, username, password, firstname, lastname, address, phone, email, isAdmin, updated_by) {
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
            updated_by: updated_by,
            updated: Date.now()
        },
        {new: true});

        // Exclude uneccessary fields
        return _.pick(user, pick_fields);
    }

    async deleteUser(id) {
        const user = await UserModel.findByIdAndRemove(id);

        // Exclude uneccessary fields
        return _.pick(user, pick_fields);
    }

    async generateAuthToken(id, isAdmin) {
        return jwt.sign({_id: id, isAdmin: isAdmin}, config.get('jwtPrivateKey'), {expiresIn: config.get('tokenExpiry')});
    }

    async authenticateUser(email, password) {
        // Lookup user's email address
        let user = await UserModel.findOne({email: email});
        
        if(!user) return null;

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);

        // Sign
        if(validPassword)
        return await this.generateAuthToken(user._id, user.isAdmin);
        
        return null;
    }

    async createAdminUser() {
        // Check if admin user is already existing
        let user = await UserModel.findOne({email: 'admin@triomm3.ph'});

        if(!user) return null;

        const username = 'admin';
        const password = 'password';
        const firstname = 'Super';
        const lastname = 'User';
        const address = {
            street: 'Apple Street',
            city: 'Makati',
            province: 'Metro Manila',
            zip: '1234'
        };
        const phone = '1234567';
        const email = 'admin@triomm3.ph';
        const isAdmin = true;
        const updated_by = null;

        return this.addUser(username, password, firstname, lastname, address, phone, email, isAdmin, updated_by);
    }
}

module.exports.class = User;
module.exports.model = UserModel;