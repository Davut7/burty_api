import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { MediaType, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { Readable } from 'stream';
import { MediaService } from '../../libs/media/media.service';
import { MinioService } from '../../libs/minio/minio.service';
import { PrismaService } from '../../utils/prisma/prisma.service';

const prisma = new PrismaClient();
const configService = new ConfigService();
const minioService = new MinioService(configService);
const prismaService = new PrismaService();
const mediaService = new MediaService(minioService, prismaService);
const imageTransformer = new ImageTransformer(minioService);

export interface ITransformedFile {
  fileName: string;
  filePath: string;
  mimeType: string;
  size: string;
  originalName: string;
  mediaType: MediaType;
}

const imagePaths = [
  './public/space.webp',
  './public/space.webp',
  './public/space.webp',
  './public/space.webp',
  './public/space.webp',
];

const userImage = ['./public/mentor.webp', './public/user.webp'];

export async function seedCategoriesAndSpaces() {
  await prisma.media.deleteMany();
  await prisma.qrCodes.deleteMany();
  await prisma.linkedSpaces.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.bookings.deleteMany();
  await prisma.spaces.deleteMany();
  await prisma.category.deleteMany();
  await prisma.users.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.linkedSpaces.deleteMany();

  await createCategoriesWithSpaces();
  await createUsersAndData();
}

async function createCategoriesWithSpaces() {
  const categories = [
    'Football',
    'Basketball',
    'Tennis',
    'Volleyball',
    'Badminton',
  ];

  for (const title of categories) {
    const category = await prisma.category.create({
      data: {
        title,
      },
    });

    for (let i = 0; i < 5; i++) {
      const image = await createMulterFile(imagePaths[i]);
      if (!image) {
        return;
      }

      const copiedImage = { ...image, filePath: `${image.path}.copy` };

      const transformedFile = await imageTransformer.transform(copiedImage);
      const space = await prisma.spaces.create({
        data: {
          name: faker.company.name(),
          address: faker.location.streetAddress(),
          site: faker.internet.url(),
          categoryId: category.id,
          phoneNumber: faker.phone.number(),
          openTime: faker.date.between({
            from: '2024-01-01T08:00:00.000Z',
            to: '2024-01-01T10:00:00.000Z',
          }),
          endTime: faker.date.between({
            from: '2024-01-01T08:00:00.000Z',
            to: '2024-01-01T10:00:00.000Z',
          }),
          longitude: faker.location.longitude(),
          latitude: faker.location.latitude(),
          minPrice: parseFloat(faker.commerce.price({ min: 50, max: 100 })),
          maxPrice: parseFloat(faker.commerce.price({ min: 100, max: 500 })),
          minPlayers: faker.number.float({ min: 2, max: 5 }),
          maxPlayers: faker.number.float({ min: 6, max: 20 }),
        },
      });
      await mediaService.createFileMedia(transformedFile, space.id, 'spaceId');
    }
  }
}

async function createUsersAndData() {
  const mentor = await prisma.users.create({
    data: {
      email: 'mentor@gmail.com',
      password: 'Mentor1234!',
      role: 'MENTOR',
      isVerified: true,
      firstName: 'Mentor',
      lastName: 'User',
      provider: 'email',
    },
  });

  const user = await prisma.users.create({
    data: {
      email: 'user@gmail.com',
      password: 'Mentor1234!',
      role: 'USER',
      isVerified: true,
      firstName: 'Regular',
      lastName: 'User',
      provider: 'email',
    },
  });

  for (const [index, userEntity] of [mentor, user].entries()) {
    const image = await createMulterFile(userImage[index]);
    if (image) {
      const transformedFile = await imageTransformer.transform(image);
      await mediaService.createFileMedia(
        transformedFile,
        userEntity.id,
        'userId',
      );
    }
  }

  const spaces = await prisma.spaces.findMany({});
  for (const space of spaces.slice(0, 3)) {
    await prisma.linkedSpaces.create({
      data: {
        mentorId: mentor.id,
        spaceId: space.id,
      },
    });
  }

  const booking = await prisma.bookings.create({
    data: {
      passType: 'single',
      startDate: new Date('2024-12-20T02:00:00.000Z'),
      startTime: '10:00',
      endTime: '12:00',
      price: 100,
      playersCount: 1,
      status: 'paid',
      userId: user.id,
      spaceId: spaces[0].id,
    },
  });

  const review = await prisma.reviews.create({
    data: {
      comment: 'Great space!',
      rating: 5,
      userId: user.id,
      spaceId: spaces[0].id,
    },
  });

  await prisma.comments.create({
    data: {
      comment: 'Thank you for your feedback!',
      userId: mentor.id,
      bookingId: booking.id,
    },
  });

  const qrCodeData = JSON.stringify({
    reviewId: review.id,
    comment: review.comment,
    rating: review.rating,
  });

  const qrCodePath = `./temp/review-qr-${review.id}.png`;
  await QRCode.toFile(qrCodePath, qrCodeData);

  const fileBuffer = await fs.promises.readFile(qrCodePath);
  const stats = await fs.promises.stat(qrCodePath);

  const multerFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: path.basename(qrCodePath),
    encoding: '7bit',
    mimetype: 'image/png',
    size: stats.size,
    buffer: fileBuffer,
    destination: './temp',
    filename: path.basename(qrCodePath),
    path: qrCodePath,
    stream: fs.createReadStream(qrCodePath),
  };

  const qrCode = await prisma.qrCodes.create({
    data: { userId: user.id, bookingId: booking.id },
  });

  const transformedFile = await imageTransformer.transform(multerFile);
  await mediaService.createFileMedia(transformedFile, qrCode.id, 'qrCodeId');
}

seedCategoriesAndSpaces()
  .then(() => {
    console.log('Seeding completed successfully.');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

type MulterFile = Express.Multer.File;

async function createMulterFile(filePath: string): Promise<MulterFile | null> {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    const stats = await fs.promises.stat(filePath);

    const tempFilePath = filePath.replace('.webp', `_temp_${Date.now()}.webp`);
    await fs.promises.writeFile(tempFilePath, fileBuffer);

    const readable = new Readable();

    const file: MulterFile = {
      fieldname: 'file',
      originalname: path.basename(filePath),
      encoding: '7bit',
      mimetype: 'image/webp',
      buffer: fileBuffer,
      size: stats.size,
      destination: './public',
      filename: path.basename(tempFilePath),
      path: tempFilePath,
      stream: readable,
    };

    return file;
  } catch (err) {
    console.error('Error reading or creating a copy of the file:', err);
    return null;
  }
}
