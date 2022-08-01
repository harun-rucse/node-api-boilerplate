const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models/user-model');
const Email = require('../../services/email-service');
const tokenService = require('../../services/token-service');

jest.mock('../../services/email-service');

describe('/api/auth', () => {
  describe('POST /login', () => {
    let user;
    let email;
    let password;

    const exec = () => {
      return request(app).post('/api/auth/login').send({ email, password });
    };

    beforeEach(async () => {
      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });
      await user.save();

      email = 'test@example.com';
      password = 'password';
    });

    it('should return 400 if email is not provided', async () => {
      email = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      password = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 401 if email is incorrect', async () => {
      email = 'incorrect';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 401 if password is incorrect', async () => {
      password = 'incorrect';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 200 if email and password are correct', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
    });
  });

  describe('POST /register', () => {
    let name;
    let email;
    let password;

    const exec = () => {
      return request(app).post('/api/auth/register').send({ name, email, password });
    };

    beforeEach(async () => {
      name = 'test';
      email = 'test@example.com';
      password = 'password';
    });

    it('should return 400 if name is not provided', async () => {
      name = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
      email = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
      email = 'invalid';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      password = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is less than 4 characters', async () => {
      password = '123';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is more than 20 characters', async () => {
      password = Array(22).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is already exists', async () => {
      await User.create({ name, email, password });
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 201 and send email for successful register', async () => {
      const mockMethod = jest.fn().mockResolvedValue(true);
      Email.mockImplementation(() => {
        return {
          sendVerifyEmail: mockMethod,
        };
      });

      const res = await exec();

      expect(res.status).toBe(201);
      expect(mockMethod).toHaveBeenCalled();
    });

    it('should return 500 if error occur while sending email', async () => {
      const mockMethod = jest.fn().mockRejectedValue(true);
      Email.mockImplementation(() => {
        return {
          sendVerifyEmail: mockMethod,
        };
      });

      const res = await exec();

      expect(res.status).toBe(500);
    });
  });

  describe('POST /forgot-password', () => {
    let email;

    const exec = () => {
      return request(app).post('/api/auth/forgot-password').send({ email });
    };

    beforeEach(async () => {
      await User.create({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });

      email = 'test@example.com';
    });

    it('should return 400 if email is not provided', async () => {
      email = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if user is not found with the email', async () => {
      email = 'another';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should send email to user with reset token', async () => {
      const mockMethod = jest.fn().mockResolvedValue(true);
      Email.mockImplementation(() => {
        return {
          sendPasswordReset: mockMethod,
        };
      });

      const res = await exec();

      const user = await User.findOne({ email });

      expect(res.status).toBe(200);
      expect(mockMethod).toHaveBeenCalled();
      expect(user.passwordResetToken).not.toBeNull();
      expect(user.passwordResetExpired).not.toBeNull();
    });

    it('should return 500 if error occur while sending email', async () => {
      const mockMethod = jest.fn().mockRejectedValue(true);
      Email.mockImplementation(() => {
        return {
          sendPasswordReset: mockMethod,
        };
      });

      const res = await exec();

      expect(res.status).toBe(500);
    });
  });

  describe('PATCH /reset-password/:token', () => {
    let user;
    let resetToken;
    let password;

    const exec = () => {
      return request(app).patch(`/api/auth/reset-password/${resetToken}`).send({ password });
    };

    beforeEach(async () => {
      resetToken = tokenService.generateRandomToken();
      password = 'newpassword';

      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });

      user.passwordResetToken = tokenService.hashToken(resetToken);
      user.passwordResetExpired = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
    });

    it('should return 400 if password is not provided', async () => {
      password = '';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is less than 4 characters', async () => {
      password = '123';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is more than 20 characters', async () => {
      password = Array(22).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if user is not found with the token', async () => {
      resetToken = 'invalid';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 with token if password is reset', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
    });
  });

  describe('GET /verify-email/:token', () => {
    let user;
    let token;

    const exec = () => {
      return request(app).get(`/api/auth/verify-email/${token}`);
    };

    beforeEach(async () => {
      token = tokenService.generateRandomToken();

      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      });

      user.emailVerifyToken = tokenService.hashToken(token);
      await user.save();
    });

    it('should return 400 if token is not provided', async () => {
      token = null;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if token is invalid', async () => {
      token = 'invalid';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if successfully verified', async () => {
      const res = await exec();

      const userDoc = await User.findOne({ email: user.email });

      expect(res.status).toBe(200);
      expect(userDoc.isVerified).toBe(true);
      expect(userDoc.emailVerifyToken).toBeUndefined();
    });
  });

  describe('PATCH /update-password', () => {
    let token;
    let user;
    let passwordCurrent;
    let password;
    let passwordConfirm;

    const exec = () => {
      return request(app)
        .patch('/api/auth/update-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ passwordCurrent, password, passwordConfirm });
    };

    beforeEach(async () => {
      passwordCurrent = 'password';
      password = 'newpassword';
      passwordConfirm = 'newpassword';

      user = new User({
        name: 'test',
        email: 'test@example.com',
        password: passwordCurrent,
      });
      await user.save();

      token = tokenService.generateJwtToken({ id: user._id });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if passwordCurrent is not provided', async () => {
      passwordCurrent = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      password = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is less than 4 characters', async () => {
      password = '123';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is more than 20 characters', async () => {
      password = Array(22).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if passwordConfirm is not provided', async () => {
      passwordConfirm = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if passwordConfirm is not equal to password', async () => {
      passwordConfirm = 'incorrect';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 401 if passwordCurrent is incorrect', async () => {
      passwordCurrent = 'incorrect';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 200 if password is updated', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
    });
  });
});
