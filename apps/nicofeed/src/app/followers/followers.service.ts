import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Follower } from '@prisma/client';
import { NicoNicoRoot } from '../model/niconico';

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

  async syncFollowers(userId: number, body): Promise<any> {
    const response = JSON.parse(body.apiResponse) as NicoNicoRoot;
    const target = response.data.items.map((element) => ({
      userid: userId,
      uploaderUserId: element.id.toString(),
      uploaderUserName: element.nickname,
      uploaderUserThumbnail: element.icons.large,
    }));
    await this.prisma.follower.createMany({
      data: target,
    });

    await this.removeDuplicateFollowers(userId);

    return await this.getFollowers(userId);
  }

  async removeDuplicateFollowers(userId: number) {
    const followers = await this.prisma.follower.findMany({
      where: { userid: userId },
      orderBy: { id: 'asc' },
    });

    const uniqueFollowers = new Map<string, number>();
    const duplicateIds: number[] = [];

    followers.forEach((follower) => {
      if (uniqueFollowers.has(follower.uploaderUserId)) {
        duplicateIds.push(follower.id);
      } else {
        uniqueFollowers.set(follower.uploaderUserId, follower.id);
      }
    });

    if (duplicateIds.length > 0) {
      await this.prisma.follower.deleteMany({
        where: { id: { in: duplicateIds } },
      });
    }

    return `Removed ${duplicateIds.length} duplicate followers for user_id ${userId}`;
  }

  async deleteFollower(id: number): Promise<void> {
    await await this.prisma.follower.delete({ where: { id } });
  }
}
