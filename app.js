// Required Modules
const mongoose = require('mongoose');				// MongoDB client
const debug_log = require('debug')('app:debug'); 	// Logging - set DEBUG environment variable
const info_log = require('debug')('app:info');
const warning_log = require('debug')('app:warning');
const error_log = require('debug')('app:error');
const config = require('config');              		// Configurations - set NODE_ENV environment variable
const morgan = require('morgan');					// HTTP logging
const helmet = require('helmet');					// Protect App with HTTP Headers
const express = require('express');					// Express

// Routers
const users = require('./routes/users');			// Users router
const items = require('./routes/items');			// Items router

// Express
const app = express();

// Log bindings - error binds to stderror by default
info_log.log = console.log.bind(console);	// log via console
debug_log.log = console.info.bind(console);	// log to info

// Check for application environment and enable necessary express middleware
info_log(`App Environment: ${app.get('env')}`);
if (app.get('env') === 'development') {
	warning_log('Warning! This is still in development...');

	// Enable HTTP request logging
	app.use(morgan('tiny'));
	debug_log('HTTP requests logging enabled.');
}

// Configuration setup
const app_name = config.get('name');
const db_server = config.get('servers.host');
const db_name = config.get('servers.database');
const db_user = config.get('servers.username');
const db_password = config.get('servers.password');
const uri =  `mongodb+srv://${db_user}:${db_password}@${db_server}/${db_name}`;

debug_log(`Application Name: ${app_name}`);
debug_log(`Database Server: ${db_server}`);
debug_log(`Database Name: ${db_name}`);
debug_log(`Database User: ${db_user}`);
debug_log(`Database Password: ${db_password}`);

// Connect to MongoDB
debug_log(`MongoDB connection string: ${uri}`);

mongoose.connect(uri, { useNewUrlParser: true })
	.then(() => debug_log('Connected to MongoDB...'))
	.catch(err => error_log('Could not connect to MongoDB...' + err));

// Set Express middleware functions
app.use(express.json());				// Parse incoming JSON payloads
app.use(helmet());						// Secure the app by setting various HTTP headers
app.use('/api/users', users);			// Route requests to users
app.use('/api/inventory/items', items);	// Route requests to items

// Listen for API requests
const port = process.env.PORT || 3000;
app.listen(port, () => info_log(`Listening on port ${port}...`));