const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateNewItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2.',
      "string.max": 'The maximum length of the "name" field is 30.',
      "string.empty": 'The "name" field must be filled in.',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in.',
      "string.uri": 'The "imageUrl" field must be a valid URL.',
    }),

    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty":
        'The "weather" field must be filled in: Please select "hot", "warm" or "cold".',
    }),
  }),
});

const validateNewUser = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "username" field must be filled in.',
      "string.min": 'The minimum length of the "username" field is 2.',
      "string.max": 'The maximum length of the "username" field is 30.',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in.',
      "string.uri": 'The "avatar" field must be a valid URL.',
    }),

    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in.',
      "string.email": 'The "email" field must be a valid email.',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in.',
    }),
  }),
});

const validateExistingUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in.',
      "string.email": 'The "email" field must be a valid email.',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in.',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.empty": 'The "id" field must be filled in.',
      "string.length": 'The "id" field must have a length of 24.',
    }),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateNewItem,
  validateNewUser,
  validateExistingUser,
  validateId,
  validateUpdateUser,
};