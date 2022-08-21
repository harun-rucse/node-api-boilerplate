const userSeeds = require('./seeds/userSeeds');

const seed = async () => {
  if (process.argv[2] === '--import') {
    await seedAll();
  } else if (process.argv[2] === '--destroy') {
    await dropAll();
  } else if (process.argv[2] === '--refresh') {
    await dropAll();
    await seedAll();
  }
  process.exit();
};

const seedAll = async () => {
  await userSeeds('seed');
};

const dropAll = async () => {
  await userSeeds('drop');
};

module.exports = { seed };
