const { faker } = require('@faker-js/faker');
const { User } = require('../../models/user-model');
const seederFactory = require('./seederFactory');

const seed = async (quantity = 1) => {
  const userData = [];

  for (let i = 0; i < quantity; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const obj = {
      name: `${firstName} ${lastName}`,
      email: faker.unique(faker.internet.email).toLocaleLowerCase(),
      password: 'password',
      role: 'user',
    };

    userData.push(obj);
  }
  await seederFactory.seedModel(User, userData);
};

const drop = async () => {
  await seederFactory.dropCollection(User);
};

module.exports = {
  seed,
  drop,
};
