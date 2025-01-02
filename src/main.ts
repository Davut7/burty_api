import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import fastifyRawBody from 'fastify-raw-body';
import 'reflect-metadata';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';
import { LoggerService } from './libs/logger/logger.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

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

  app
    .getHttpAdapter()
    .getInstance()
    .register(fastifyRawBody, {
      field: 'rawBody',
      global: false,
      routes: ['/stripe/webhook'],
    });

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Your server is listening on port ${port}`);
  });
}

bootstrap();
