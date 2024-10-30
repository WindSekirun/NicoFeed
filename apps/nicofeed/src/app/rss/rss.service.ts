import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import Parser from 'rss-parser';

@Injectable()
export class RssService {
  private readonly parser = new Parser();

  constructor(private prisma: PrismaService) {}

  @Cron('*/10 * * * *')
  async fetchVideos() {
    const followers = await this.prisma.follower.findMany();

    for (const follower of followers) {
      const feed = await this.parser.parseURL(`https://www.nicovideo.jp/user/${follower.uploaderUserId}/video?rss=2.0`);

      for (const item of feed.items) {
        const existingVideo = await this.prisma.video.findFirst({
          where: { videoLink: item.link, userid: follower.userid },
        });

        if (!existingVideo) {
          await this.prisma.video.create({
            data: {
              userid: follower.userid,
              videoTitle: item.title,
              videoLink: item.link,
              videoPubDate: new Date(item.pubDate),
              videoThumbnail: item.media?.thumbnail,
              requestDateTime: new Date(),
            },
          });
        }
      }
    }
  }
}