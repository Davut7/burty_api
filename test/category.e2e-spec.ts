import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockCategories, mockCategory } from './mocks/category.mock';

describe('Category E2E Test', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);
    await app.init();

    prismaClient.$connect();

    await prismaClient.category.createMany({
      data: mockCategories,
    });
  });

  afterAll(async () => {
    await prismaClient.category.deleteMany({
      where: {
        id: {
          in: mockCategories.map((category) => category.id),
        },
      },
    });

    await prismaClient.$disconnect();
    await app.close();
  });

  it('/GET category (success)', async () => {
    const response = await request(app.getHttpServer())
      .get('/category')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toEqual(expect.arrayContaining(mockCategories));
  });

  it('/GET category/:id (success)', async () => {
    const categoryId = mockCategory.id;

    const response = await request(app.getHttpServer())
      .get(`/category/${categoryId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', categoryId);
    expect(response.body).toHaveProperty('title', mockCategory.title);
    expect(response.body).toHaveProperty('spaces', mockCategory.spaces);
  });

  it('/GET category/:id (failure - not found)', async () => {
    const invalidCategoryId = 'invalid-category-id';

    await request(app.getHttpServer())
      .get(`/category/${invalidCategoryId}`)
      .expect(404);
  });
});
