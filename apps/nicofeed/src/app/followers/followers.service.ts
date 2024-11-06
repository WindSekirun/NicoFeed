import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Follower } from '@prisma/client';

@Injectable()
export class FollowersService {
  constructor(private prisma: PrismaService) {}

  async getFollowers(userId: number): Promise<Follower[]> {
    return await this.prisma.follower.findMany({
      where: { userid: userId },
      orderBy: {
        uploaderUserName: 'asc',
      },
    });
  }

  async syncFollowers(
    userId: number,
    data: { userId: string; nickname: string; iconUrl: string }[]
  ) {
    const target = data
      .filter((element) => element.userId)
      .map((element) => ({
        userid: userId,
        uploaderUserId: element.userId.toString(),
        uploaderUserName: element.nickname,
        uploaderUserThumbnail: element.iconUrl,
      }));

    const existingFollowers = await this.prisma.follower.findMany({
      where: { userid: userId },
    });

    const existingIds = new Set(existingFollowers.map((f) => f.uploaderUserId));
    const newIds = new Set(target.map((t) => t.uploaderUserId));

    const followersToAdd = target.filter(
      (t) => !existingIds.has(t.uploaderUserId)
    );

    const followersToRemove = existingFollowers
      .filter((f) => !newIds.has(f.uploaderUserId))
      .map((f) => f.uploaderUserId);

    if (followersToAdd.length > 0) {
      await this.prisma.follower.createMany({
        data: followersToAdd,
      });
    }

    if (followersToRemove.length > 0) {
      await this.prisma.follower.deleteMany({
        where: {
          userid: userId,
          uploaderUserId: { in: followersToRemove },
        },
      });
    }

    return await this.getFollowers(userId);
  }

  async deleteFollower(id: number): Promise<void> {
    await await this.prisma.follower.delete({ where: { id } });
  }
}
