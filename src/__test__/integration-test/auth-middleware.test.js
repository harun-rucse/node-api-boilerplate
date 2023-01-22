const request = require('supertest');
const { User } = require('../../models/user-model');
const app = require('../../app');
const tokenService = require('../../services/token-service');

describe('auth middleware', () => {
  describe('protect', () => {
    let token;
    let user;

    const exec = () => {
      return request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });
      await user.save();

      token = tokenService.generateJwtToken({ id: user._id });
    });

    it('should return 401 if token is not provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if JWT token is invalid', async () => {
      token = 'invalid token';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 401 if JWT token is expired', async () => {
      token = tokenService.generateJwtToken({ id: user._id }, { expiresIn: '1ms' });

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 401 if user belonging to this token does no longer exist', async () => {
      await User.deleteOne({ email: user.email });

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 401 if user changed password after the token was issued', async () => {
      user.passwordChangeAt = Date.now() + 2000;
      await user.save();

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 200 if token is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });

  describe('verified', () => {
    let token;
    let user;

    const exec = () => {
      return request(app).get('/api/users/my-profile').set('Authorization', `Bearer ${token}`);
    };

    beforeEach(async () => {
      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });

      user.isVerified = true;
      await user.save();

      token = tokenService.generateJwtToken({ id: user._id });
    });

    it('should return 403 if user is not verified', async () => {
      user.isVerified = false;
      await user.save();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 200 if user is verified', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });
});
