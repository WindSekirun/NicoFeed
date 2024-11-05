import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import Parser from 'rss-parser';
import axios from 'axios';

@Injectable()
export class RssService implements OnModuleInit {
  private readonly parser = new Parser();
  private readonly thumbnailRegex = /<img[^>]+src="([^">]+)"/;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV == 'production') {
      this.fetchVideos();
    }
  }

  @Cron('*/10 * * * *')
  async fetchVideos() {
    const followers = await this.prisma.follower.findMany();

    for (const follower of followers) {
      const url = `https://www.nicovideo.jp/user/${follower.uploaderUserId}/video?rss=2.0`;
      const response = await axios.get(url);
      const feed = await this.parser.parseString(response.data);

      for (const item of feed.items) {
        const existingVideo = await this.prisma.video.findFirst({
          where: { videoLink: item.link, userid: follower.userid },
        });
        const match = item.content.match(this.thumbnailRegex);
        let thumbnail = '';
        if (match && match[1]) {
          thumbnail = match[1];
        }

        if (!existingVideo) {
          await this.prisma.video.create({
            data: {
              userid: follower.userid,
              videoTitle: item.title,
              videoLink: item.link,
              videoPubDate: new Date(item.pubDate),
              videoThumbnail: thumbnail,
              requestDateTime: new Date(),
              uploaderUserId: follower.uploaderUserId,
            },
          });
        }
      }
    }
  }
}
