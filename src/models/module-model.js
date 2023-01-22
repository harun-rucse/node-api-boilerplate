const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const moduleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const validateModule = (module) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
  });

  return schema.validate(module);
};

const Module = model('Module', moduleSchema);

module.exports = {
  Module,
  validateModule,
};
