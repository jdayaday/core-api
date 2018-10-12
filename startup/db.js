// Requried modules
const mongoose = require('mongoose');   // MongoDB client
const winston = require('winston');     // Logging module
const config = require('config');       // Configurations - set NODE_ENV environment variable

module.exports = function() {
    // Configuration setup
    const app_name = config.get('name');
    const db_server = config.get('servers.host');
    const db_name = config.get('servers.database');
    const db_user = config.get('servers.username');
    const db_password = config.get('servers.password');
    const uri =  `mongodb+srv://${db_user}:${db_password}@${db_server}/${db_name}`;

    winston.info(`Application Name: ${app_name}`);
    winston.info(`Database Server: ${db_server}`);
    winston.info(`Database Name: ${db_name}`);
    winston.info(`Database User: ${db_user}`);
    winston.info(`Database Password: ${db_password}`);

    // Connect to MongoDB
    winston.info(`MongoDB connection string: ${uri}`);

    mongoose.connect(uri, { useNewUrlParser: true })
	.then(() => winston.info('Connected to MongoDB...'))
}