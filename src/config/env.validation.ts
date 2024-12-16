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
  JWT_RESET_SECRET: Joi.string().required(),
  JWT_RESET_TIME: Joi.string().required(),

  MONGO_USERNAME: Joi.string().required(),
  MONGO_PASSWORD: Joi.string().required(),
  MONGO_DATABASE: Joi.string().required(),
  MONGO_HOST: Joi.string().required(),
  MONGODB_URI: Joi.string().required(),

  //GOOGLE
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URI: Joi.string().required(),

  //UTILS
  REDIS_ACCESS_TOKEN_TIME: Joi.string().required(),
  HEALTH_CHECK_TOKEN: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),

  //DIRECTUS
  DIRECTUS_KEY: Joi.string().optional(),
  DIRECTUS_SECRET: Joi.string().optional(),
  DIRECTUS_ADMIN_EMAIL: Joi.string().optional(),
  DIRECTUS_ADMIN_PASSWORD: Joi.string().optional(),
  DIRECTUS_ADMIN_NAME: Joi.string().optional(),
  DIRECTUS_URL: Joi.string().optional(),
}).unknown(true);

export function validate(config: Record<string, unknown>) {
  const validConfig = Object.keys(config)
    .filter((key) => configSchema.describe().keys[key])
    .reduce((acc, key) => {
      acc[key] = config[key];
      return acc;
    }, {});

  const { error, value } = configSchema.validate(validConfig, {
    abortEarly: false,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
