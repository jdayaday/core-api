// Required Modules
const debug = require('debug')('app:startup'); 	// Logging - set DEBUG environment variable
const config = require('config');              	// Configurations - set NODE_ENV environment variable
const morgan = require('morgan');				// HTTP logging
const helmet = require('helmet');				// Protect App with HTTP Headers
const express = require('express');				// Express
const users = require('./routes/users');		// Users router

const app = express();

// Configuration setup
console.log(`Application Name: ${config.get('name')}`);
console.log(`Database Server: ${config.get('servers.database')}`);
console.log(`Database Password: ${config.get('servers.password')}`);

// Check for application environment and enable necessary express middleware
console.log(`App Environment: ${app.get('env')}`);
if (app.get('env') === 'development') {
	// Enable HTTP request logging
	app.use(morgan('tiny'));
	debug('HTTP requests logging enabled.');
}

// Set Express middleware functions
app.use(express.json());		// Parse incoming JSON payloads
app.use(helmet());				// Secure the app by setting various HTTP headers
app.use('/api/users', users);	// Route requests to users

// Listen for API requests
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));