import { Controller, Get, Query, Req } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  async getVideos(@Req() req, @Query('page') page: string) {
    const pageNum = parseInt(page, 10) || 1;
    return this.videoService.getVideosByUser(req.user.userId, pageNum);
  }
}
