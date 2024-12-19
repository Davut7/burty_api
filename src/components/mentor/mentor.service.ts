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
            space: { include: { medias: true } },
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
        space: {
          include: { medias: true, reviews: true },
        },
      },
    });

    return linkedSpaces.map((link) => {
      const { space } = link;
      const averageRating = space.reviews.length
        ? space.reviews.reduce((sum, review) => sum + review.rating, 0) /
          space.reviews.length
        : 0;

      return {
        ...space,
        averageRating,
        reviews: space.reviews,
      };
    });
  }

  async getOneLinkedSpace(userId: string, spaceId: string) {
    const linkedSpace = await this.prismaService.linkedSpaces.findFirst({
      where: {
        mentorId: userId,
        spaceId,
      },
      include: {
        space: {
          include: { medias: true, reviews: true },
        },
      },
    });

    if (!linkedSpace) {
      throw new NotFoundException('Linked space not found');
    }

    const { space } = linkedSpace;
    const averageRating = space.reviews.length
      ? space.reviews.reduce((sum, review) => sum + review.rating, 0) /
        space.reviews.length
      : 0;

    return {
      ...space,
      averageRating,
      reviews: space.reviews,
    };
  }
}
