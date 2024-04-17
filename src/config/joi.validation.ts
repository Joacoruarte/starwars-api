import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().default(8080),
  BASE_URL: Joi.string().default('https://swapi.dev/api'),
});
