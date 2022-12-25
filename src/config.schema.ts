import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().required(),

  TWITTER_CONSUMER_KEY: Joi.string().required(),
  TWITTER_CONSUMER_SECRET: Joi.string().required(),
  TWITTER_BEARER_TOKEN: Joi.string().required(),
  TWITTER_ACCESS_TOKEN: Joi.string().required(),
  TWITTER_ACCESS_TOKEN_SECRET: Joi.string().required(),
});
