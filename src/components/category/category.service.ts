import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { GetCategoriesQuery } from './query/getCategories.query';
import { CategoryType } from 'src/helpers/types/category/category.type';
import { CategoryResponseType } from 'src/helpers/types/category/category.response';

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

  async getOneCategory(categoryId: string): Promise<CategoryResponseType> {
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
