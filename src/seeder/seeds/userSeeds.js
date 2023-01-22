const { User } = require('../../models/user-model');
const { Role } = require('../../models/role-model');
// const userFactory = require('../factories/userFactory');

module.exports = async (type) => {
  if (type === 'seed') {
    // await userFactory.seed(500);
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'password',
      role: await Role.findOne({ slug: 'admin' }).select('_id'),
    });

    await User.create({
      name: 'User',
      email: 'user@gmail.com',
      password: 'password',
      role: await Role.findOne({ slug: 'user' }).select('_id'),
    });
  } else if (type === 'drop') {
    // await userFactory.drop();
    await User.deleteMany({});
  }
};
