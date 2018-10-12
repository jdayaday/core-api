// Required Modules
const winston = require('winston'); // Logging
const express = require('express');	// Express

// Express
const app = express();

require('./startup/logging')();		// Logging
require('./startup/routes')(app);	// Setup routes
require('./startup/db')();			// Connect to MongoDB
require('./startup/config')();		// Config setup
require('./startup/validation')();	// Validation

// Listen for API requests
const port = process.env.API_PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
