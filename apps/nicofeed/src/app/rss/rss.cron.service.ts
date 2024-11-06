import { Injectable, OnModuleInit } from '@nestjs/common';
import { RssService } from './rss.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RssCronService implements OnModuleInit {
  constructor(private rss: RssService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV == 'production') {
      this.fetchVideos();
    }
  }

  @Cron('*/10 * * * *')
  async fetchVideos() {
    this.rss.fetchVideos();
  }
}
