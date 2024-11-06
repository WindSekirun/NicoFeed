import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { RssService } from '../rss/rss.service';

@Module({
  imports: [],
  controllers: [FollowersController],
  providers: [FollowersService, PrismaService, RssService],
})
export class FollowersModule {}
