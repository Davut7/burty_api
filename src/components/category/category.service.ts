import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { GetCategoriesQuery } from './query/getCategories.query';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async getCategories(query: GetCategoriesQuery) {
    const { take = 10, page = 1 } = query;
    return await this.prismaService.category.findMany({
      take,
      skip: (page - 1) * take,
      include: { _count: true },
    });
  }

  async getOneCategory(categoryId: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
      include: { spaces: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    return category;
  }
}
