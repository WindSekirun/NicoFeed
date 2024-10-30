import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Follower } from '@prisma/client';
import { NicoNicoRoot } from '../model/niconico';

@Injectable()
export class FollowersService {
  constructor(private prisma: PrismaService) {}

  async getFollowers(userId: number): Promise<Follower[]> {
    return await this.prisma.follower.findMany({ where: { userid: userId } });
  }

  async syncFollowers(userId: number, body): Promise<any> {
    await this.prisma.follower.deleteMany({
      where: {
        userid: userId,
      },
    });

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
    return await this.getFollowers(userId);
  }

  async deleteFollower(id: number): Promise<void> {
    await await this.prisma.follower.delete({ where: { id } });
  }
}
