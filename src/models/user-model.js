const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema, model } = mongoose;
const { Role } = require('./role-model');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: 'default.jpeg',
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: Role.modelName,
      default: '630b78585e407325228fb79a',
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpired: Date,
    emailVerifyToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre save hook that hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre save hook that add passwordChangeAt when password is changed
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;

  next();
});

// Pre find hook that populate the role
userSchema.pre(/^find/, function (next) {
  this.populate('role', 'name slug deletable');

  next();
});

// Return true if password is correct, otherwise return false
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Return true if password is changed after JWT issued
userSchema.methods.passwordChangeAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const passwordChangeTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return passwordChangeTimestamp > JWTTimestamp;
  }
  return false;
};

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(4).max(20).required().label('Password'),
    avatar: Joi.string().label('Avatar'),
    role: Joi.string().label('Role'),
  });

  return schema.validate(user);
};

const validateUserUpdate = (user) => {
  const schema = Joi.object({
    name: Joi.string().label('Name'),
    email: Joi.string().email().label('Email'),
    avatar: Joi.string().label('Avatar'),
    role: Joi.string().label('Role'),
    emailVerifiedAt: Joi.date().label('Email Verified At'),
  });

  return schema.validate(user);
};

const validateUserPassword = (user) => {
  const schema = Joi.object({
    password: Joi.string().min(4).max(20).required().label('Password'),
  });

  return schema.validate(user);
};

const validateUpdatePassword = (user) => {
  const schema = Joi.object({
    passwordCurrent: Joi.string().required().label('Current Password'),
    password: Joi.string().min(4).max(20).required().label('Password'),
    passwordConfirm: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
  });

  return schema.validate(user);
};

const User = model('User', userSchema);

module.exports = {
  User,
  validateUser,
  validateUserUpdate,
  validateUserPassword,
  validateUpdatePassword,
};
