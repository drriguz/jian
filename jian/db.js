const mongoose = require('mongoose');
const url = 'mongodb://localhost/jian-db';
const logger = require('log4js').getLogger('db');

mongoose.Promise = require('bluebird');

mongoose.connect(url);

mongoose.connection.on('connected', () => {
    logger.info('Mongodb @' + url + ' connected');
});

mongoose.connection.on('error', (error) => {
    logger.error(error);
});

mongoose.connection.on('disconnected', () => {
    logger.info('Mongodb disconnected');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        logger.info('Mongoose connection disconnected');
        process.exit(0);
    })
});
