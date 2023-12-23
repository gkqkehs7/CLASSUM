import Joi from 'joi';

export const validationSchema = Joi.object({
  // db secrets
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  // jwt secrets
  JWT_SECRET: Joi.string().required(),
});
