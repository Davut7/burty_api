import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { GetNearbySpacesQuery } from './query/getNearbySpaces.query';
import { GetSpacesByFilterQuery } from './query/getSpacesByFilter.query';
import { SpacesType } from 'src/helpers/types/spaces.type';
import { GetOneSpaceQuery } from './query/getOneSpace.query';
import { GetSpacesResponse } from './responses/getSpaces.response';

@Injectable()
export class SpacesService {
  private earthRadius = 6371;
  constructor(private prismaService: PrismaService) {}

  private calculateDistance(
    latitude: number,
    longitude: number,
    spaceLat: number,
    spaceLon: number,
  ): number {
    return +(
      this.earthRadius *
      Math.acos(
        Math.cos(this.toRadians(latitude)) *
          Math.cos(this.toRadians(spaceLat)) *
          Math.cos(this.toRadians(spaceLon) - this.toRadians(longitude)) +
          Math.sin(this.toRadians(latitude)) *
            Math.sin(this.toRadians(spaceLat)),
      )
    );
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getNearbySpaces(
    query: GetNearbySpacesQuery,
  ): Promise<GetSpacesResponse[]> {
    const {
      latitude,
      longitude,
      page = 1,
      take = 10,
      maxDistance = 10,
    } = query;
    const spaces = await this.prismaService.spaces.findMany({
      skip: (page - 1) * take,
      take,
    });

    return spaces
      .map((space) => ({
        ...space,
        distance: this.calculateDistance(
          latitude,
          longitude,
          space.latitude,
          space.longitude,
        ),
      }))
      .filter((space) => space.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  async getPopularSpaces(query: GetNearbySpacesQuery): Promise<SpacesType[]> {
    const {
      latitude,
      longitude,
      page = 1,
      take = 10,
      maxDistance = 10,
    } = query;

    const spaces = await this.prismaService.spaces.findMany({
      take,
      skip: (page - 1) * take,
      include: {
        reviews: true,
      },
    });

    return spaces
      .map((space) => ({
        ...space,
        average_rating: space.reviews.length
          ? space.reviews.reduce((sum, review) => sum + review.rating, 0) /
            space.reviews.length
          : 0,
        distance: this.calculateDistance(
          latitude,
          longitude,
          space.latitude,
          space.longitude,
        ),
      }))
      .filter((space) => space.distance <= maxDistance)
      .sort((a, b) => {
        if (a.average_rating === b.average_rating) {
          return a.distance - b.distance;
        }
        return b.average_rating - a.average_rating;
      });
  }

  async getSpacesByFilter(
    query: GetSpacesByFilterQuery,
  ): Promise<SpacesType[]> {
    const {
      take = 10,
      page = 1,
      maxDistance,
      maxPrice,
      latitude,
      longitude,
      minPrice,
      passType,
      q = '',
    } = query;

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }
    if (passType) {
      where.passType = passType;
    }

    const spaces = await this.prismaService.spaces.findMany({
      where,
      take,
      skip: (page - 1) * take,
    });

    return spaces
      .map((space) => ({
        ...space,
        distance: this.calculateDistance(
          latitude,
          longitude,
          space.latitude,
          space.longitude,
        ),
      }))
      .filter((space) => space.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  async getOneSpace(
    spaceId: string,
    query: GetOneSpaceQuery,
  ): Promise<GetSpacesResponse> {
    const { latitude, longitude } = query;
    const space = await this.prismaService.spaces.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new NotFoundException('Space not found!');
    }

    return {
      ...space,
      distance: this.calculateDistance(
        latitude,
        longitude,
        space.latitude,
        space.longitude,
      ),
    };
  }
}
