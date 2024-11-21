import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, UserRole } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { ImageTransformer } from '../../common/pipes/imageTransform.pipe';
import { MediaService } from '../../libs/media/media.service';
import { MinioService } from '../../libs/minio/minio.service';
import { PrismaService } from '../../utils/prisma/prisma.service';

const prisma = new PrismaClient();
const configService = new ConfigService();
const minioService = new MinioService(configService);
const prismaService = new PrismaService();
const mediaService = new MediaService(minioService, prismaService);
const imageTransformer = new ImageTransformer(minioService);

export async function seedUsers() {
  await prisma.users.deleteMany();

  await createUser();
}

const imagePaths = ['./public/user.webp', './public/mentor.webp'];

const users = [{ role: 'USER' }, { role: 'MENTOR' }];

const userPasswords = ['User123!', 'Mentor123!'];

async function createUser() {
  for (const user of users) {
    const newUser = await prisma.users.create({
      data: {
        email: faker.internet.email(),
        password: userPasswords[users.indexOf(user)],
        role: user.role as UserRole,
        provider: 'email',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        isVerified: true,
      },
    });

    const image = await createMulterFile(
      imagePaths[user.role === 'USER' ? 0 : 1],
    );
    const transformedFile = await imageTransformer.transform(image);
    await mediaService.createFileMedia(transformedFile, newUser.id, 'userId');
  }
}

seedUsers()
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
