import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class SpaceCommonService {
  constructor(private prismaService: PrismaService) {}

  async getSpaceById(spaceId: string) {
    const space = await this.prismaService.spaces.findUnique({
      where: { id: spaceId },
    });
    if (!space) {
      throw new NotFoundException('Space not found!');
    }
    return space;
  }
}
