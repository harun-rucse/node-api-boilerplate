const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });
const databaseSeeder = require('./databaseSeeder');

require('../startup/db')();

console.log(`---Seeding to ${process.env.NODE_ENV} database---`);
databaseSeeder.seed();
