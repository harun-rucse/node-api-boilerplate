const authService = require('../services/auth-service');
const tokenService = require('../services/token-service');
const { validateUser, validateUserPassword, validateUpdatePassword } = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const user = await authService.register(req.body);
  const token = tokenService.generateJwtToken({ id: user._id });

  res.status(201).json(token);
});

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password is required.', 400));
  }

  const user = await authService.login(email, password);
  const token = tokenService.generateJwtToken({ id: user._id });

  res.status(200).json(token);
});

/**
 * @desc    Forgot password request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('Email address is required.', 400));
  }

  await authService.forgotPassword(req.body.email);

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});

/**
 * @desc    Reset the password
 * @route   PATCH /api/auth/reset-password/resetToken
 * @access  Public
 */
const resetPassword = catchAsync(async (req, res, next) => {
  const { error } = validateUserPassword(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const user = await authService.resetPassword(req.params.resetToken, req.body.password);
  const token = tokenService.generateJwtToken({ id: user._id });

  res.status(200).json(token);
});

/**
 * @desc    Update my current password
 * @route   PATCH /api/auth/update-password
 * @access  Private
 */
const updatePassword = catchAsync(async (req, res, next) => {
  const { error } = validateUpdatePassword(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const { passwordCurrent, password } = req.body;

  const user = await authService.updatePassword(req.user.id, passwordCurrent, password);
  const token = tokenService.generateJwtToken({ id: user._id });

  res.status(200).json(token);
});

/**
 * @desc    Active account by email verification
 * @route   GET /api/auth/verify-email/token
 * @access  Public
 */
const vefiryEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError('Token is required.', 400));

  await authService.verifyEmail(token);

  res.status(200).json({ status: 'success', message: 'Your account is now verified.' });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  vefiryEmail,
};
