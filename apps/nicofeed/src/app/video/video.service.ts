import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  // 페이지당 10개씩 영상 불러오기
  async getVideosByUser(userId: number, page = 1) {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    return this.prisma.video.findMany({
      where: { userid: userId },
      orderBy: { videoPubDate: 'desc' },
      skip,
      take: pageSize,
    });
  }
}
