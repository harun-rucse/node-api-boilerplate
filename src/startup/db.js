const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {
  mongoose.connect(config.DATABASE_URL).then(() => console.log('DB connection successful!'));
};
