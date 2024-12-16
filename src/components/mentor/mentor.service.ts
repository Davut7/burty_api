import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class MentorService {
  constructor(private prismaService: PrismaService) {}

  async getMe(userId: string) {
    const mentor = await this.prismaService.users.findUnique({
      where: { id: userId },
      include: {
        linkedSpaces: {
          include: {
            space: true,
          },
        },
      },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    return mentor;
  }

  async getLinkedSpaces(userId: string) {
    const linkedSpaces = await this.prismaService.linkedSpaces.findMany({
      where: { mentorId: userId },
      include: {
        space: true,
      },
    });

    return linkedSpaces.map((link) => link.space);
  }

  async getOneLinkedSpace(userId: string, spaceId: string) {
    const linkedSpace = await this.prismaService.linkedSpaces.findFirst({
      where: {
        mentorId: userId,
        spaceId,
      },
      include: {
        space: true,
      },
    });

    if (!linkedSpace) {
      throw new NotFoundException('Linked space not found');
    }

    return linkedSpace.space;
  }
}
