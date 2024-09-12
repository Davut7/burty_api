import * as Joi from 'joi';

const configSchema = Joi.object({
  PORT: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_PORT: Joi.string().required(),
  MINIO_USE_SSL: Joi.boolean().required(),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET_NAME: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_RESET_SECRET: Joi.string().required(),
  JWT_ACCESS_TIME: Joi.string().required(),
  JWT_REFRESH_TIME: Joi.string().required(),
  JWT_RESET_TIME: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  environment: Joi.string().required(),
  NOT_SAVE_IN_DB_CONTEXTS: Joi.string().required(),
  NOT_LOG_CONTEXTS: Joi.string().required(),
  NOT_LOG_HTTP_URLS: Joi.string().required(),
  SENTRY_DNS: Joi.string().required(),
}).unknown(true); // This allows unknown keys in the environment variables

export function validate(config: Record<string, unknown>) {
  const { error, value } = configSchema.validate(config, { abortEarly: false });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}
