import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Comments E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST comments (success)', async () => {
    const commentData = {
      postId: 1,
      userId: 1,
      content: 'This is a test comment',
    };

    const response = await request(app.getHttpServer())
      .post('/comments')
      .send(commentData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('postId', commentData.postId);
    expect(response.body).toHaveProperty('userId', commentData.userId);
    expect(response.body).toHaveProperty('content', commentData.content);
  });

  it('/POST comments (failure)', async () => {
    const invalidCommentData = {
      postId: 1,
      userId: 1,
      content: '',
    };

    await request(app.getHttpServer())
      .post('/comments')
      .send(invalidCommentData)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
