import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    try {
      await app.init();
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/registration', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'user',
        })
        .expect(201);

      expect(response.body.message).toBe('Регистрация пользователя успешна');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return conflict error if user already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'user',
        })
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.message).toBe('Успешный вход пользователя!');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return not found error if user does not exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(404);
    });

    it('should return bad request error if password is incorrect', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh tokens', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: loginResponse.body.refreshToken,
        })
        .expect(201);

      expect(response.body.message).toBe('Токены успешно обновлены');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return unauthorized error if refresh token is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalidtoken',
        })
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout a user', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .send({
          refreshToken: loginResponse.body.refreshToken,
        })
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200);

      expect(response.body.message).toBe('User logged out');
    });

    it('should return unauthorized error if access token is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .send({
          refreshToken: 'sometoken',
        })
        .expect(401);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should initiate forgot password process', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'test@example.com',
        })
        .expect(200);

      expect(response.body.message).toBe('Код сброса пароля успешно отправлен');
      expect(response.body).toHaveProperty('id');
    });

    it('should return not found error if user does not exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(404);
    });
  });

  describe('PATCH /auth/forgot-password/:userId/verify', () => {
    it('should verify forgot password code', async () => {
      const forgotPasswordResponse = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'test@example.com',
        });

      const response = await request(app.getHttpServer())
        .patch(`/auth/forgot-password/${forgotPasswordResponse.body.id}/verify`)
        .send({
          verificationCode: '123456', // Replace with actual code from Redis
        })
        .expect(200);

      expect(response.body.message).toBe('Password verified successfully!');
      expect(response.body).toHaveProperty('link');
    });

    it('should return bad request error if verification code is wrong', async () => {
      const forgotPasswordResponse = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'test@example.com',
        });

      await request(app.getHttpServer())
        .patch(`/auth/forgot-password/${forgotPasswordResponse.body.id}/verify`)
        .send({
          verificationCode: 'wrongcode',
        })
        .expect(400);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset password', async () => {
      const forgotPasswordResponse = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'test@example.com',
        });

      const verifyResponse = await request(app.getHttpServer())
        .patch(`/auth/forgot-password/${forgotPasswordResponse.body.id}/verify`)
        .send({
          verificationCode: '123456', // Replace with actual code from Redis
        });

      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          password: 'newpassword123',
        })
        .set('Authorization', `Bearer ${verifyResponse.body.link}`)
        .expect(200);

      expect(response.body.message).toBe('User password updated successfully!');
    });

    it('should return unauthorized error if reset token is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          password: 'newpassword123',
        })
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });

  describe('GET /auth/reset-password', () => {
    it('should validate reset password link', async () => {
      const forgotPasswordResponse = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: 'test@example.com',
        });

      const verifyResponse = await request(app.getHttpServer())
        .patch(`/auth/forgot-password/${forgotPasswordResponse.body.id}/verify`)
        .send({
          verificationCode: '123456', // Replace with actual code from Redis
        });

      const response = await request(app.getHttpServer())
        .get('/auth/reset-password')
        .query({
          resetToken: verifyResponse.body.link,
          userId: forgotPasswordResponse.body.id,
        })
        .expect(200);

      expect(response.body.message).toBe('Reset password link is verified');
      expect(response.body).toHaveProperty('resetToken');
    });

    it('should return bad request error if reset link is expired', async () => {
      await request(app.getHttpServer())
        .get('/auth/reset-password')
        .query({
          resetToken: 'expiredtoken',
          userId: 'someuserid',
        })
        .expect(400);
    });
  });
});
