// Required Modules
const config = require('config');
const morgan = require('morgan');
const express = require('express');

const app = express();

// Configuration
console.log(`Application Name: ${config.get('name')}`);
console.log(`Database Server: ${config.get('servers.database')}`);
console.log(`Database Password: ${config.get('servers.password')}`);

// Check for application environment and enable necessary express middleware
console.log(`App Environment: ${app.get('env')}`);
if (app.get('env') === 'development') {
	// Enable HTTP request logging
	app.use(morgan('tiny'));
	console.log('HTTP requests logging enabled.');
}

// Listen for API requests
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));