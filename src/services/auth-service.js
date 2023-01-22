const _ = require('lodash');
const config = require('../config');
const { User } = require('../models/user-model');
const AppError = require('../utils/app-error');
const Email = require('./email-service');
const tokenService = require('./token-service');
const userService = require('./user-service');

const register = async (payload) => {
  // check if email is already exists
  const isExists = await userService.getOneUser({ email: payload.email });
  if (isExists) {
    throw new AppError('Email is already exists.', 400);
  }

  // Save to the database
  const user = await userService.createNewUser(_.pick(payload, ['name', 'email', 'password']));

  // Get the email verification token
  const token = tokenService.generateRandomToken();

  // Hash the token and set emailVerifyToken property
  user.emailVerifyToken = tokenService.hashToken(token);
  await user.save({ validateBeforeSave: false });

  // Send email verification
  const verifyUrl = `${config.BASE_URL}/api/auth/verify-email/${token}`;
  try {
    await new Email(user, verifyUrl).sendVerifyEmail();
  } catch (err) {
    // delete user from the database if there is an error sending the email
    await userService.deleteOneUser({ _id: user._id });

    throw new AppError('There was an error sending the email. Please try again!', 500);
  }

  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  const isMatch = await user?.correctPassword(password, user.password);

  if (!isMatch) {
    throw new AppError('Incorrect email or password.', 401);
  }

  return user;
};

const forgotPassword = async (email) => {
  // 1) Get user based on POSTed email
  const user = await userService.getOneUser({ email });

  if (!user) {
    throw new AppError('There is no user with email address.', 404);
  }

  // 2) Generate the random password reset token
  const resetToken = tokenService.generateRandomToken();

  // 3) Hash the token and set it to the user document
  user.passwordResetToken = tokenService.hashToken(resetToken);

  // 4) Set the password reset token expiration in miliseconds
  user.passwordResetExpired = Date.now() + config.PASSWORD_RESET_TOKEN_EXPIRES_IN * 60 * 1000;

  // 5) Save the user document
  await user.save({ validateBeforeSave: false });

  // 6) Send the reset token to the user
  const resetURL = `${config.BASE_URL}/api/auth/reset-password/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();
  } catch (err) {
    // 7) If there is an error sending the email, remove the password reset token and expiration
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError('There was an error sending the email.', 500);
  }
};

const resetPassword = async (resetToken, password) => {
  // 1) Hash the reset token
  const hashedToken = tokenService.hashToken(resetToken);

  // 2) Get user based on the reset token
  const user = await userService.getOneUser({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired.', 400);
  }

  // 3) If token has not expired, and there is user, set the new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  return user.save();
};

const updatePassword = async (currentUserId, passwordCurrent, password) => {
  // 1) Get current logged in user
  const user = await userService.getOneUser({ _id: currentUserId }).select('+password');

  // 2) Check if current password is correct
  const isMatch = await user.correctPassword(passwordCurrent, user.password);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 401);
  }

  // 3) Set the new password
  user.password = password;
  return user.save();
};

const verifyEmail = async (token) => {
  // 1) Hash the token
  const hashedToken = tokenService.hashToken(token);

  // 2) Get user based on the hash token
  let user = await userService.getOneUser({
    emailVerifyToken: hashedToken,
  });

  if (!user) {
    throw new AppError('Token is invalid or already verified.', 400);
  }

  // 3) Set isVerified and remove emailVerifyToken property from user
  user.isVerified = true;
  user.emailVerifyToken = undefined;

  return user.save();
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
};
