import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  async getVideos(@Req() req, @Query('page') page: string) {
    const pageNum = parseInt(page, 10) || 1;
    return this.videoService.getVideosByUser(req.user.id, pageNum);
  }
}
