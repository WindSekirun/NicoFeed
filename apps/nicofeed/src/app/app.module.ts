import { Module } from '@nestjs/common';;
import { VideoModule } from './video/video.module';
import { RssService } from './rss/rss.service';
import { FollowersModule } from './followers/followers.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    VideoModule,
    FollowersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads', 
    }),
  ],
  controllers: [],
  providers: [RssService, PrismaService],
})
export class AppModule {}
