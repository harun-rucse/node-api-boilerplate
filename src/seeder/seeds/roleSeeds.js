const { Permission } = require('../../models/permission-model');
const { Role } = require('../../models/role-model');

module.exports = async (type) => {
  if (type === 'seed') {
    const permissions = await Permission.find();

    await Role.create({
      _id: '630b78585e407325228fb798',
      name: 'Admin',
      slug: 'admin',
      permissions: permissions.map((permission) => permission._id),
      deletable: false,
    });

    await Role.create({
      _id: '630b78585e407325228fb79a',
      name: 'User',
      slug: 'user',
      permissions: permissions
        .filter((permission) => permission.slug === 'app.users.getall')
        .map((permission) => permission._id),
      deletable: false,
    });
  } else if (type === 'drop') {
    await Permission.deleteMany({});
    await Role.deleteMany({});
  }
};
