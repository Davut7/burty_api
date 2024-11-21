import * as Joi from 'joi';

const configSchema = Joi.object({
  //APP
  ENVIRONMENT: Joi.string().required(),
  PORT: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),

  //DATABASE
  DATABASE_URL: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  //MINIO
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_HOST: Joi.string().required(),
  MINIO_PORT: Joi.string().required(),
  MINIO_USE_SSL: Joi.boolean().required(),
  MINIO_ROOT_USER: Joi.string().required(),
  MINIO_ROOT_PASSWORD: Joi.string().required(),
  MINIO_BUCKET_NAME: Joi.string().required(),

  //REDIS
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),

  //JWT
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_TIME: Joi.string().required(),
  JWT_REFRESH_TIME: Joi.string().required(),

  //GOOGLE
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URI: Joi.string().required(),

  //FACEBOOK
  FACEBOOK_CLIENT_ID: Joi.string().required(),
  FACEBOOK_CLIENT_SECRET: Joi.string().required(),
  FACEBOOK_REDIRECT_URI: Joi.string().required(),

  //UTILS
  SENTRY_DNS: Joi.string().required(),
  REDIS_ACCESS_TOKEN_TIME: Joi.string().required(),
  HEALTH_CHECK_TOKEN: Joi.string().required(),
}).unknown(false);

export function validate(config: Record<string, unknown>) {
  const { error, value } = configSchema.validate(config, { abortEarly: false });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
