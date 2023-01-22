const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { seed } = require('../seeder/databaseSeeder');

let mongod;
beforeAll(async () => {
  mongod = new MongoMemoryServer();
  const mongoUri = await mongod.getUri();

  await mongoose.connect(mongoUri);

  // Seed the database
  await seed();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    // Clear the database except for the module, roles and permissions collection
    if (!['modules', 'roles', 'permissions'].includes(collection.collectionName)) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.connection.close();
});
