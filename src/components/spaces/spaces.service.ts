import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { GetNearbySpacesQuery } from './query/getNearbySpaces.query';
import { GetSpacesByFilterQuery } from './query/getSpacesByFilter.query';

@Injectable()
export class SpacesService {
  constructor(private prismaService: PrismaService) {}

  async getNearbySpaces(query: GetNearbySpacesQuery) {
    const {
      latitude,
      longitude,
      page = 1,
      take = 10,
      maxDistance = 10,
    } = query;
    const earthRadius = 6371;

    return await this.prismaService.$queryRaw`
      SELECT *, 
        (
          ${earthRadius} * acos(
            cos(radians(${latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(latitude))
          )
        ) AS distance
      FROM "Spaces"
      WHERE 
        (
          ${earthRadius} * acos(
            cos(radians(${latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(latitude))
          )
        ) < ${maxDistance}
      ORDER BY distance
      LIMIT ${take} OFFSET ${(page - 1) * take};
    `;
  }

  async getPopularSpaces(query: GetNearbySpacesQuery) {
    const {
      latitude,
      longitude,
      page = 1,
      take = 10,
      maxDistance = 10,
    } = query;
    const earthRadius = 6371;

    return await this.prismaService.$queryRaw`
      SELECT 
        s.*, 
        COALESCE(AVG(r.star), 0) AS average_rating,
        (
          ${earthRadius} * acos(
            cos(radians(${latitude})) * 
            cos(radians(s.latitude)) * 
            cos(radians(s.longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(s.latitude))
          )
        ) AS distance
      FROM "Spaces" s
      LEFT JOIN "Reviews" r ON s.id = r.spaceId
      WHERE 
        (
          ${earthRadius} * acos(
            cos(radians(${latitude})) * 
            cos(radians(s.latitude)) * 
            cos(radians(s.longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(s.latitude))
          )
        ) < ${maxDistance}
      GROUP BY s.id
      ORDER BY average_rating DESC, distance ASC
      LIMIT ${take} OFFSET ${(page - 1) * take};
    `;
  }

  async getSpacesByFilter(query: GetSpacesByFilterQuery) {
    const {
      take = 10,
      page = 1,
      maxDistance,
      maxPrice,
      latitude,
      longitude,
      minPrice,
      passType,
      visitTime,
      q = '',
      categoryIds,
    } = query;

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (categoryIds && categoryIds.length > 0) {
      where.categoryId = {
        in: categoryIds,
      };
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

    if (visitTime) {
      const [startTime, endTime] = visitTime.split('-');
      where.AND = [
        { availableFrom: { lte: startTime } },
        { availableTo: { gte: endTime } },
      ];
    }

    const earthRadius = 6371;
    return await this.prismaService.$queryRaw`
      SELECT *, 
        (
          ${earthRadius} * acos(
            cos(radians(${latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(latitude))
          )
        ) AS distance
      FROM "Spaces"
      WHERE 
        (
          ${earthRadius} * acos(
            cos(radians(${latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(latitude))
          )
        ) < ${maxDistance}
        AND ${this.generateWhereClause(where)}
      ORDER BY distance
      LIMIT ${take} OFFSET ${(page - 1) * take};
    `;
  }

  private generateWhereClause(where: any): string {
    const conditions: string[] = [];

    if (where.categoryId) {
      conditions.push(
        `categoryId IN (${where.categoryId.in.map((id: string) => `'${id}'`).join(',')})`,
      );
    }

    if (where.price) {
      if (where.price.gte !== undefined) {
        conditions.push(`price >= ${where.price.gte}`);
      }
      if (where.price.lte !== undefined) {
        conditions.push(`price <= ${where.price.lte}`);
      }
    }

    if (where.passType) {
      conditions.push(`passType = '${where.passType}'`);
    }

    if (where.AND) {
      conditions.push(
        `availableFrom <= '${where.AND[0].availableFrom.lte}' AND availableTo >= '${where.AND[1].availableTo.gte}'`,
      );
    }

    if (where.OR) {
      conditions.push(
        `(${where.OR.map(
          (condition: any) =>
            `name ILIKE '%${condition.name.contains}%' OR description ILIKE '%${condition.description.contains}%'`,
        ).join(' OR ')})`,
      );
    }

    return conditions.length > 0 ? `${conditions.join(' AND ')}` : '1=1';
  }

  async getOneSpace(spaceId: string) {
    const space = await this.prismaService.spaces.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new NotFoundException('Space not found!');
    }

    return space;
  }
}
