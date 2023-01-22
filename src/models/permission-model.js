const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { Module } = require('./module-model');

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: Module.modelName,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const validatePermission = (permission) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    slug: Joi.string().required().label('Slug'),
    module: Joi.string().required().label('Module Id'),
  });

  return schema.validate(permission);
};

const Permission = model('Permission', permissionSchema);

module.exports = {
  Permission,
  validatePermission,
};
