const userSeeds = require('./seeds/userSeeds');
const roleSeeds = require('./seeds/roleSeeds');
const permissionSeeds = require('./seeds/permissionSeeds');

const seed = async () => {
  if (process.argv[2] === '--import') {
    await seedAll();
  } else if (process.argv[2] === '--destroy') {
    await dropAll();
  } else if (process.argv[2] === '--refresh' || process.env.NODE_ENV === 'test') {
    await dropAll();
    await seedAll();
  }
  if (process.env.NODE_ENV !== 'test') process.exit();
};

const seedAll = async () => {
  await permissionSeeds('seed');
  await roleSeeds('seed');
  await userSeeds('seed');
};

const dropAll = async () => {
  await userSeeds('drop');
  await roleSeeds('drop');
  await permissionSeeds('drop');
};

module.exports = { seed };
