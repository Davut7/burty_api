import { MediaType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { MediaService } from '../../libs/media/media.service';
import { MinioService } from '../../libs/minio/minio.service';
import { Readable } from 'stream';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';

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
  './public/football.webp',
  './public/basketball.webp',
  './public/tennis.webp',
  './public/volleyball.webp',
  './public/volleyball.webp',
];

export async function seedCategoriesAndSpaces() {
  await prisma.spaces.deleteMany();
  await prisma.category.deleteMany();

  await createCategoriesWithSpaces();
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

      const transformedFile = await imageTransformer.transform(image);
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

    const readable = new Readable();

    const file: MulterFile = {
      fieldname: 'file',
      originalname: path.basename(filePath),
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: fileBuffer,
      size: stats.size,
      destination: './public',
      filename: path.basename(filePath),
      path: filePath,
      stream: readable,
    };

    return file;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
}
