import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryResponseType } from 'src/helpers/types/category/category.response';
import { CategoryType } from 'src/helpers/types/category/category.type';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { GetCategoriesQuery } from './query/getCategories.query';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async getCategories(query: GetCategoriesQuery): Promise<CategoryType[]> {
    const { take = 10, page = 1 } = query;
    return await this.prismaService.category.findMany({
      take,
      skip: (page - 1) * take,
    });
  }

  async getOneCategory(
    categoryId: string,
    userId: string,
  ): Promise<CategoryResponseType> {
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
      include: { spaces: { include: { medias: true, reviews: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    const enhancedSpaces = await Promise.all(
      category.spaces.map(async (space) => {
        const isBooked = !!(await this.prismaService.bookings.findFirst({
          where: {
            spaceId: space.id,
            userId: userId,
            status: 'paid',
            startDate: { gte: new Date() },
          },
        }));

        return {
          ...space,
          isBooked,
        };
      }),
    );

    return {
      ...category,
      spaces: enhancedSpaces,
    };
  }
}
