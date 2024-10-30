import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Follower } from '@prisma/client';

@Injectable()
export class FollowersService {
  constructor(private prisma: PrismaService) {}

  async getFollowers(userId: number): Promise<Follower[]> {
    return this.prisma.follower.findMany({ where: { userid: userId } });
  }

  async addFollower(userId: number, followerData: any): Promise<Follower> {
    return this.prisma.follower.create({
      data: { userid: userId, ...followerData },
    });
  }

  async deleteFollower(id: number): Promise<void> {
    await this.prisma.follower.delete({ where: { id } });
  }
}
