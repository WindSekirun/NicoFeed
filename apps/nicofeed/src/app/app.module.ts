import { Module } from '@nestjs/common';;
import { VideoModule } from './video/video.module';
import { FollowersModule } from './followers/followers.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { RssCronService } from './rss/rss.cron.service';
import { RssService } from './rss/rss.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    VideoModule,
    FollowersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads', 
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [],
  providers: [RssCronService, RssService, PrismaService],
})
export class AppModule {}
