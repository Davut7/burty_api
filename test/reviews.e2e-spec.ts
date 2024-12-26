import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ReviewsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let bookingId: string;
  let reviewId: string;
  let spaceId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
    await prisma.$connect();

    const user = await prisma.users.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        isVerified: true,
        provider: 'email',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      },
    });
    userId = user.id;

    const space = await prisma.spaces.create({
      data: {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        site: faker.internet.url(),
        phoneNumber: faker.phone.number(),
        openTime: faker.date.recent(),
        endTime: faker.date.future(),
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        minPrice: faker.number.float({ min: 10, max: 100 }),
        maxPrice: faker.number.float({ min: 100, max: 1000 }),
        minPlayers: faker.number.int({ min: 1, max: 5 }),
        maxPlayers: faker.number.int({ min: 5, max: 20 }),
      },
    });
    spaceId = space.id;

    const booking = await prisma.bookings.create({
      data: {
        userId: user.id,
        spaceId: space.id,
        startDate: faker.date.recent(),
        startTime: faker.date.recent().toDateString(),
        endTime: faker.date.future().toDateString(),
        isArchived: true,
        price: faker.number.float({ min: 10, max: 100 }),
        playersCount: faker.number.int({ min: 1, max: 10 }),
        status: 'paid',
      },
    });
    bookingId = booking.id;
  });

  afterAll(async () => {
    try {
      await prisma.reviews.deleteMany({});
      await prisma.bookings.deleteMany({});
      await prisma.spaces.deleteMany({});
      await prisma.users.deleteMany({});
    } catch (err) {
      console.error('Error during cleanup', err);
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
      if (app) {
        await app.close();
      }
    }
  });

  it('/reviews/:bookingId (POST)', async () => {
    const createReviewDto = {
      rating: 5,
      comment: 'Great space!',
    };

    const response = await request(app.getHttpServer())
      .post(`/reviews/${bookingId}`)
      .set('Authorization', `Bearer ${userId}`)
      .send(createReviewDto)
      .expect(201);

    reviewId = response.body.id;
    expect(response.body).toMatchObject(createReviewDto);
  });

  it('/reviews/:bookingId (POST) - should fail if rating is missing', async () => {
    const createReviewDto = {
      comment: 'Great space!',
    };

    await request(app.getHttpServer())
      .post(`/reviews/${bookingId}`)
      .set('Authorization', `Bearer ${userId}`)
      .send(createReviewDto)
      .expect(400);
  });

  it('/reviews/:reviewId (PATCH)', async () => {
    const updateReviewDto = {
      rating: 4,
      comment: 'Good space!',
    };

    const response = await request(app.getHttpServer())
      .patch(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${userId}`)
      .send(updateReviewDto)
      .expect(200);

    expect(response.body).toMatchObject(updateReviewDto);
  });

  it('/reviews/:reviewId (PATCH) - should fail if review does not exist', async () => {
    const updateReviewDto = {
      rating: 4,
      comment: 'Good space!',
    };

    await request(app.getHttpServer())
      .patch(`/reviews/nonexistentReviewId`)
      .set('Authorization', `Bearer ${userId}`)
      .send(updateReviewDto)
      .expect(404);
  });

  it('/reviews/:spaceId (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/reviews/${spaceId}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      rating: 4,
      comment: 'Good space!',
    });
  });

  it('/reviews/:spaceId (GET) - should return empty array if no reviews', async () => {
    const response = await request(app.getHttpServer())
      .get(`/reviews/nonexistentSpaceId`)
      .expect(200);

    expect(response.body).toHaveLength(0);
  });

  it('/reviews/:reviewId (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${userId}`)
      .expect(200);

    expect(response.body).toEqual({ message: 'Review deleted successfully!' });
  });

  it('/reviews/:reviewId (DELETE) - should fail if review does not exist', async () => {
    await request(app.getHttpServer())
      .delete(`/reviews/nonexistentReviewId`)
      .set('Authorization', `Bearer ${userId}`)
      .expect(404);
  });
});
