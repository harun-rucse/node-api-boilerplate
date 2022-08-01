const { User } = require('../models/user-model');
const tokenService = require('../services/token-service');

module.exports = async (role = 'user', isVerified = true) => {
  const user = new User({
    name: 'test',
    email: 'test',
    password: 'test',
    role,
    isVerified,
  });
  await user.save();

  return tokenService.generateJwtToken({ id: user._id });
};
