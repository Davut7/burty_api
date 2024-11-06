import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class MentorService {
  constructor(private prismaService: PrismaService) {}

  async getMe() {}

  async getLinkedSpaces() {}

  async getOneLinkedSpace() {}
}
