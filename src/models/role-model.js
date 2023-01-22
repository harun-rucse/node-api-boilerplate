const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { Permission } = require('./permission-model');

const roleSchema = new Schema(
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
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: Permission.modelName,
        required: true,
      },
    ],
    notes: String,
    deletable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre find hook that populate the permissions
roleSchema.pre(/^find/, function (next) {
  this.populate('permissions', 'name slug');

  next();
});

const validateRole = (role) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    slug: Joi.string().required().label('Slug'),
    permissions: Joi.array().required().label('Permissions'),
    notes: Joi.string().label('Notes'),
    deletable: Joi.boolean().label('Deletable'),
  });

  return schema.validate(role);
};

const Role = model('Role', roleSchema);

module.exports = {
  Role,
  validateRole,
};
