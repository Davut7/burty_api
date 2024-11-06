import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async archiveBookings() {
    const bookings = await this.prismaService.bookings.findMany({
      where: { startDate: { lt: new Date() } },
    });

    if (bookings.length > 0) {
      await this.prismaService.bookings.updateMany({
        where: { id: { in: bookings.map((b) => b.id) } },
        data: { isArchived: true },
      });
    }

    return;
  }
}
