import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

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
      await prisma.spaces.create({
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
