import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as compression from 'compression';
import * as Sentry from '@sentry/node';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  LogLevel,
  ValidationPipe,
} from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'debug', 'verbose'];
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: logLevels,
    },
  );

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');
  Sentry.init({
    dsn: configService.getOrThrow<'string'>('SENTRY_DNS'),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),

      nodeProfilingIntegration(),
    ],

    tracesSampleRate: 1.0,

    profilesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());

  app.use(Sentry.Handlers.tracingHandler());

  const config = new DocumentBuilder()
    .setTitle('Burty server')
    .setDescription('Burty server api documentation')
    .setVersion('1.0')
    .addTag('Burty')
    .addServer('/api')
    .setContact('David', 'https://t.me/Davut_7', '20031212dawut@gmail.com')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  const theme = new SwaggerTheme();

  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    useGlobalPrefix: true,
  };

  if (configService.get('ENVIRONMENT') !== 'prod') {
    SwaggerModule.setup('api/docs', app, document, options);
  }

  app.register(fastifyHelmet);
  app.register(fastifyCsrfProtection, { cookieOpts: { signed: true } });
  app.register(fastifyCors, {
    origin: '*',
  });

  app.register(multipart);
  await app.register(fastifyCookie, {
    secret: configService.getOrThrow<'string'>('COOKIE_SECRET'),
  });

  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Your server is listening on port ${port}`);
  });

  app.use(Sentry.Handlers.tracingHandler());
}

bootstrap();
