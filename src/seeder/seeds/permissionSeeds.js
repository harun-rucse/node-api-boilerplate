const { Module } = require('../../models/module-model');
const { Permission } = require('../../models/permission-model');

module.exports = async (type) => {
  if (type === 'seed') {
    console.log('---Seeding to Module collection---');

    const dashboardModule = await Module.create({
      name: 'Admin Dashboard',
    });

    const roleModule = await Module.create({
      name: 'Role Management',
    });

    console.log('---Seeding Complete---');
    console.log('---Seeding to Permission collection---');

    await Permission.create({
      module: dashboardModule.id,
      name: 'Access Dashboard',
      slug: 'app.dashboard.access',
    });

    await Permission.create({
      module: roleModule.id,
      name: 'Access Role',
      slug: 'app.roles.getall',
    });

    await Permission.create({
      module: roleModule.id,
      name: 'Access Single Role',
      slug: 'app.roles.getone',
    });

    await Permission.create({
      module: roleModule.id,
      name: 'Create Role',
      slug: 'app.roles.create',
    });

    await Permission.create({
      module: roleModule.id,
      name: 'Update Role',
      slug: 'app.roles.update',
    });

    await Permission.create({
      module: roleModule.id,
      name: 'Delete Role',
      slug: 'app.roles.delete',
    });

    const userModule = await Module.create({
      name: 'User Management',
    });

    await Permission.create({
      module: userModule.id,
      name: 'Access User',
      slug: 'app.users.getall',
    });

    await Permission.create({
      module: userModule.id,
      name: 'Access Single User',
      slug: 'app.users.getone',
    });

    await Permission.create({
      module: userModule.id,
      name: 'Create User',
      slug: 'app.users.create',
    });

    await Permission.create({
      module: userModule.id,
      name: 'Update User',
      slug: 'app.users.update',
    });

    await Permission.create({
      module: userModule.id,
      name: 'Delete User',
      slug: 'app.users.delete',
    });

    console.log('---Seeding Complete---');
  } else if (type === 'drop') {
    console.log('---Module collection dropped---');
    await Module.deleteMany({});

    console.log('---Permission collection dropped---');
    await Permission.deleteMany({});
  }
};
