const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const { User } = require('../../models/user-model');
const authenticate = require('../authenticate');

describe('/api/users', () => {
  describe('GET /', () => {
    let token;

    const exec = () => {
      return request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      token = await authenticate('admin');
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return all users', async () => {
      const users = [
        { name: 'user1', email: 'user1@example.com', password: 'password' },
        { name: 'user2', email: 'user2@example.com', password: 'password' },
      ];
      await User.collection.insertMany(users);

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.some((user) => user.name === 'user1')).toBeTruthy();
      expect(res.body.some((user) => user.name === 'user2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    let token;
    let user;
    let id;

    const exec = () => {
      return request(app).get(`/api/users/${id}`).set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });
      await user.save();

      token = await authenticate('admin');
      id = user._id;
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not an admin', async () => {
      await User.deleteMany({});
      token = await authenticate('user');

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return a user if valid id is passed', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', user.name);
    });

    it('should return 404 if user not found with id', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if invalid id is passed', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid _id: 1');
    });
  });

  describe('POST /', () => {
    let token;
    let name;
    let email;
    let password;

    const exec = () => {
      return request(app).post('/api/users').send({ name, email, password }).set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      token = await authenticate('admin');
      name = 'test';
      email = `${new Date().getTime()}@example.com`;
      password = 'password';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not an admin', async () => {
      await User.deleteMany({});
      token = await authenticate('user');

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if name is missing', async () => {
      name = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is missing', async () => {
      email = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      password = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
      email = 'not valid';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 is password is less than 4 characters', async () => {
      password = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 is password is more than 20 characters', async () => {
      password = Array(22).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 201 if user is created', async () => {
      const res = await exec();

      const user = await User.findOne({ email });

      expect(res.status).toBe(201);
      expect(user).not.toBeNull();
    });
  });

  describe('PATCH /:id', () => {
    let token;
    let user;
    let newName;
    let email;
    let role;
    let emailVerifiedAt;
    let id;

    const exec = () => {
      return request(app)
        .patch(`/api/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: newName, email, role, emailVerifiedAt });
    };

    beforeEach(async () => {
      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });
      await user.save();

      token = await authenticate('admin');
      id = user._id;
      newName = 'updatedName';
      email = 'update@example.com';
      role = user.role;
      emailVerifiedAt = new Date();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not an admin', async () => {
      await User.deleteMany({});
      token = await authenticate('user');

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if invalid id is passed', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if user not found with id', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 400 if invalid email is passed', async () => {
      email = 'not valid';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if provided role is invalid', async () => {
      role = 'not valid';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if emailVerifiedAt is not a date', async () => {
      emailVerifiedAt = 'not a date';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if user is updated', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let user;
    let id;

    const exec = () => {
      return request(app).delete(`/api/users/${id}`).set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });
      await user.save();

      token = await authenticate('admin');
      id = user._id;
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not an admin', async () => {
      await User.deleteMany({});
      token = await authenticate('user');

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if invalid id is passed', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if user not found with id', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 204 if user is deleted', async () => {
      const res = await exec();

      expect(res.status).toBe(204);
    });
  });

  describe('GET /my-profile', () => {
    let token;

    const exec = () => {
      return request(app).get('/api/users/my-profile').set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      token = await authenticate('user');
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if client email is not verified', async () => {
      await User.deleteMany({});
      token = await authenticate('user', false);

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 200 for successful get profile', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'test');
    });
  });

  describe('PATCH /update-me', () => {
    let token;
    let newName;
    let email;

    const exec = () => {
      return request(app)
        .patch('/api/users/update-me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: newName, email });
    };

    beforeEach(async () => {
      token = await authenticate('user');
      newName = 'updatedName';
      email = 'updated@example.com';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if client email is not verified', async () => {
      await User.deleteMany({});
      token = await authenticate('user', false);

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if invalid email is passed', async () => {
      email = 'not valid';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if client successfully update profile', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });
});
