import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async getVideosByUser(userId: number, page = 1, uploaderUserId?: string) {
    const pageSize = 20;
    const skip = (page - 1) * pageSize;
  
    return this.prisma.video.findMany({
      where: { 
        userid: userId,
        ...(uploaderUserId ? { uploaderUserId: uploaderUserId } : {}),
      },
      orderBy: { videoPubDate: 'desc' },
      skip,
      take: pageSize,
      include: {
        follower: true,
      },
    });
  }
  
}
