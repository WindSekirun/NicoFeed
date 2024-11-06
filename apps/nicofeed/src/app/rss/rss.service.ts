import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Parser from 'rss-parser';
import axios from 'axios';
import { getLastPathWithoutQuery } from '../utils/url';

@Injectable()
export class RssService {
  private readonly parser = new Parser();
  private readonly thumbnailRegex = /<img[^>]+src="([^">]+)"/;

  constructor(private prisma: PrismaService) {}

  async fetchVideos() {
    const followers = await this.prisma.follower.findMany();

    Promise.all(
      followers.map(async (follower) => {
        const pageCount = follower.initialSync ? 1 : 10;
        const newVideos = [];

        for (let i = 1; i <= pageCount; i++) {
          try {
            const url = `https://www.nicovideo.jp/user/${follower.uploaderUserId}/video?rss=2.0&page=${i}`;
            const response = await axios.get(url);
            const feed = await this.parser.parseString(response.data);

            for (const item of feed.items) {
              const existingVideo = await this.prisma.video.findFirst({
                where: { videoLink: item.link, userid: follower.userid },
              });

              if (!existingVideo) {
                const match = item.content.match(this.thumbnailRegex);
                const thumbnail = match?.[1] || '';

                newVideos.push({
                  userid: follower.userid,
                  videoTitle: item.title,
                  videoLink: getLastPathWithoutQuery(item.link),
                  videoPubDate: new Date(item.pubDate),
                  videoThumbnail: thumbnail.replace(
                    'https://nicovideo.cdn.nimg.jp/thumbnails/',
                    ''
                  ),
                  uploaderUserId: follower.uploaderUserId,
                });
              }
            }
          } catch (error) {
            console.error(
              `Error fetching videos for user ${follower.uploaderUserId}: ${error.message}`
            );
          }
        }

        const removeDuplicates = Array.from(
          new Map(newVideos.map((item) => [item.videoLink, item])).values()
        );

        if (removeDuplicates.length > 0) {
          await this.prisma.video.createMany({
            data: removeDuplicates,
          });
        }

        await this.prisma.follower.update({
          where: { id: follower.id },
          data: { initialSync: true },
        });
      })
    );
  }
}
