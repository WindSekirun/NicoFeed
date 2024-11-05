import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async getVideosByUser(userId: number, page = 1) {
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    return this.prisma.video.findMany({
      where: { userid: userId },
      orderBy: { videoPubDate: 'desc' },
      skip,
      take: pageSize,
      include: {
        follower: true
      }
    });
  }
}
