import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

@Module({
  imports: [],
  controllers: [FollowersController],
  providers: [FollowersService, PrismaService],
})
export class FollowersModule {}
