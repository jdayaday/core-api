// Required Modules
const mongoose = require('mongoose');			// MongoDB client
const debug = require('debug')('app:startup'); 	// Logging - set DEBUG environment variable
const config = require('config');              	// Configurations - set NODE_ENV environment variable
const morgan = require('morgan');				// HTTP logging
const helmet = require('helmet');				// Protect App with HTTP Headers
const express = require('express');				// Express
const users = require('./routes/users');		// Users router

// Express
const app = express();

// Check for application environment and enable necessary express middleware
console.log(`App Environment: ${app.get('env')}`);
if (app.get('env') === 'development') {
	// Enable HTTP request logging
	app.use(morgan('tiny'));
	debug('HTTP requests logging enabled.');
}

// Configuration setup
const app_name = config.get('name');
const db_server = config.get('servers.host');
const db_name = config.get('servers.database');
const db_user = config.get('servers.username');
const db_password = config.get('servers.password');
const uri =  `mongodb+srv://${db_user}:${db_password}@${db_server}/${db_name}`;

debug(`Application Name: ${app_name}`);
debug(`Database Server: ${db_server}`);
debug(`Database Name: ${db_name}`);
debug(`Database User: ${db_user}`);
debug(`Database Password: ${db_password}`);

// Connect to MongoDB
debug(`MongoDB connection string: ${uri}`);

mongoose.connect(uri, { useNewUrlParser: true })
	.then(() => debug('Connected to MongoDB...'))
	.catch(err => debug('Could not connect to MongoDB...'));

// Set Express middleware functions
app.use(express.json());		// Parse incoming JSON payloads
app.use(helmet());				// Secure the app by setting various HTTP headers
app.use('/api/users', users);	// Route requests to users

// Listen for API requests
const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));