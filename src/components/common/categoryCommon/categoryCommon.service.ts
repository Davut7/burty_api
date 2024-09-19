import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class CategoryCommonService {
  constructor(private prismaService: PrismaService) {}

  async findCategoryById(categoryId: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    return category;
  }
}
