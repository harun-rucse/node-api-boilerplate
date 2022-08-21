const userFactory = require('../factories/userFactory');

module.exports = async (type) => {
  if (type === 'seed') {
    await userFactory.seed(500);
  } else if (type === 'drop') {
    await userFactory.drop();
  }
};
