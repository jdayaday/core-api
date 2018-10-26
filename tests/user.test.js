const User = require('../classes/user');
const userObject = new User();
const async_timeout = 30000;

require('../startup/logging')();	// Logging
require('../startup/db')();			// Connect to MongoDB
require('../startup/config')();		// Config setup

let user = {};

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
let email = 'admin@triomm3.ph';
const isAdmin = true;
const updated_by = null;

describe('addUser', () => {
    it('should return newly created user', async () => {
        user = await userObject.addUser(username, password, firstname, lastname, address, phone, email, isAdmin, updated_by);
        expect(user).toHaveProperty('email', email);
    }, async_timeout);
});

describe('getUsers', () => {
    it('should return the list of users', async () => {
        const result = await userObject.getUsers();
        expect(result).toContainEqual(expect.objectContaining({'_id': user._id}));
    }, async_timeout);
})

describe('updateUser', () => {
    it('should return the updated user', async () => {
        email = 'administrator@triomm3.ph';
        const result = await userObject.updateUser(user._id, username, password, firstname, lastname, address, phone, email, isAdmin, user._id);
        expect(result).toHaveProperty('_id', user._id);
        expect(result).toHaveProperty('email', email);
    }, async_timeout);
});

describe('getUser', () => {
    it('should return the specified user', async () => {
        const result = await userObject.getUser(user._id);
        expect(result).toHaveProperty('_id', user._id);
        expect(result).toHaveProperty('email', email);
    }, async_timeout);
});

describe('deleteUser', () => {
    it('should return the deleted user', async () => {
        const result = await userObject.deleteUser(user._id);
        expect(result).toHaveProperty('_id', user._id);
    }, async_timeout);
});
