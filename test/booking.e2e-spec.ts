import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Booking E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST booking (success)', async () => {
    const bookingData = {
      userId: 1,
      roomId: 101,
      startDate: '2023-10-01',
      endDate: '2023-10-05',
    };

    const response = await request(app.getHttpServer())
      .post('/booking')
      .send(bookingData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('status', 'confirmed');
    expect(response.body).toHaveProperty('userId', bookingData.userId);
    expect(response.body).toHaveProperty('roomId', bookingData.roomId);
  });

  it('/POST booking (failure - invalid data)', async () => {
    const invalidBookingData = {
      userId: 1,
      roomId: 101,
      startDate: 'invalid-date',
      endDate: '2023-10-05',
    };

    await request(app.getHttpServer())
      .post('/booking')
      .send(invalidBookingData)
      .expect(400);
  });

  it('/POST booking (failure - duplicate booking)', async () => {
    const duplicateBookingData = {
      userId: 1,
      roomId: 101,
      startDate: '2023-10-01',
      endDate: '2023-10-05',
    };

    await request(app.getHttpServer())
      .post('/booking')
      .send(duplicateBookingData)
      .expect(409);
  });

  it('/GET booking/:id (success)', async () => {
    const bookingId = 1; // replace with a valid booking ID

    const response = await request(app.getHttpServer())
      .get(`/booking/${bookingId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', bookingId);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('roomId');
  });

  it('/GET booking/:id (failure - not found)', async () => {
    const invalidBookingId = 9999; // replace with an invalid booking ID

    await request(app.getHttpServer())
      .get(`/booking/${invalidBookingId}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
