const request = require('supertest');
const userModel = require('../../classes/user').model;
const User = require('../../classes/user').class;
const userObject = new User();

let server;
let token;

const testUsers = [
    {
        username: 'user1',
        password: 'password',
        firstname: 'John',
        lastname: 'Doe',
        address: {
            street: '1st Street',
            city: 'Makati',
            province: 'Metro Manila',
            zip: '1234'
        },
        phone: '1234567',
        email: 'john.doe@triomm3.ph',
        isAdmin: false,
        updated_by: null
    },
    {
        username: 'user2',
        password: 'password',
        firstname: 'Jane',
        lastname: 'Doe',
        address: {
            street: '1st Street',
            city: 'Makati',
            province: 'Metro Manila',
            zip: '1234'
        },
        phone: '1234567',
        email: 'jane.doe@triomm3.ph',
        isAdmin: false,
        updated_by: null
    }
];

describe('/api/users', () => {
    beforeEach(async () => {
        // Set test server
        server = require('../../app');
    });
    afterEach(async () => {
        server.close();

        // Cleanup records
        await userModel.deleteMany({});
    });

    describe('GET /', () => {
        it('should prevent access without a web token', async () => {
            // Insert user without authentication token
            await userModel.collection.insertMany(testUsers);

            const response = await request(server).get('/api/users');
            
            expect(response.status).toBe(401);
        });
        it('should prevent unauthorized access', async () => {
            // Generate auth token without admin priviledges
            token = await userObject.generateAuthToken('1', false);

            // Insert user without admin privledges
            await userModel.collection.insertMany(testUsers);

            const response = await request(server)
                .get('/api/users')
                .set('x-auth-token', token);
            
            expect(response.status).toBe(403);
        });
        it('should return all users', async () => {
            // Generate auth token with admin priviledges
            token = await userObject.generateAuthToken('1', true);

            // Create users
            await userModel.collection.insertMany(testUsers);

            const response = await request(server)
                .get('/api/users')
                .set('x-auth-token', token);
            
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(u => u.username === 'user1')).toBeTruthy();
            expect(response.body.some(u => u.username === 'user2')).toBeTruthy();
        });
    });
});