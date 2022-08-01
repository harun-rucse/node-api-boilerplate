const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const generateJwtToken = (payload, option = { expiresIn: config.JWT_EXPIRES_IN }) => {
  return jwt.sign(payload, config.JWT_SECRET, option);
};

const verifyJwtToken = (token) => {
  return promisify(jwt.verify)(token, config.JWT_SECRET);
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateJwtToken,
  verifyJwtToken,
  hashToken,
  generateRandomToken,
};
