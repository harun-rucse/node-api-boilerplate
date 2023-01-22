const { User } = require('../models/user-model');
const { Role } = require('../models/role-model');
const tokenService = require('../services/token-service');

module.exports = async (slug = 'user', isVerified = true) => {
  const user = new User({
    name: 'test',
    email: 'test',
    password: 'test',
    role: await Role.findOne({ slug }).select('_id'),
    isVerified,
  });
  await user.save();

  return tokenService.generateJwtToken({ id: user._id });
};
