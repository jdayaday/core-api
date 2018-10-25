// Required modules
const express = require('express');
const winston = require('winston');                 // Logging module
const helmet = require('helmet');					// Protect App with HTTP Headers
const error = require('../middleware/error');		// Error middleware
const morgan = require('morgan');					// HTTP logging
const cors = require('cors');                       // CORS handler

// Routes
const users = require('../routes/users');			// Users router
const items = require('../routes/items');			// Items router
const orders = require('../routes/orders');			// Orders router
const vendors = require('../routes/vendors');       // Vendors router
const locations = require('../routes/locations');   // Locations router
const auth = require('../routes/auth');				// Authentication router


module.exports = function(app) {
    // Check for application environment and enable necessary express middleware
    winston.info(`App Environment: ${app.get('env')}`);
    if (app.get('env') === 'development') {
        winston.warn('Warning! This is still in development...');

        // Enable HTTP request logging
        app.use(morgan('tiny'));
        winston.info('HTTP requests logging enabled.');
    }

    // Set Express middleware functions
    const corsOptions = {
        origin: '*'
    }

    app.use(express.json());					    // Parse incoming JSON payloads
    app.use(helmet());							    // Secure the app by setting various HTTP headers
    app.use(cors(corsOptions));                     // Allow CORS
    app.use('/api/users', users);				    // Route requests to users
    app.use('/api/inventory/items', items);		    // Route requests to items
    app.use('/api/inventory/orders', orders);	    // Route requests to orders
    app.use('/api/inventory/vendors', vendors);     // Route requests to vendors
    app.use('/api/inventory/locations', locations); // Route requests to locations
    app.use('/api/auth', auth);					    // Route requests to auth

    app.use(error);
}