import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import axios from 'axios';
import { DOMParser } from 'xmldom';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  async getVideos(@Req() req, @Query('page') page: string, @Query('uploader_user_id') uploaderUserId?: string) {
    const pageNum = parseInt(page, 10) || 1;
    return this.videoService.getVideosByUser(req.user.id, pageNum, uploaderUserId);
  }

  @Get('/description/:videoLink')
  async getVideoDescription(@Param('videoLink') videoLink: string) {
    try {
      const response = await axios.get(`https://ext.nicovideo.jp/api/getthumbinfo/${videoLink}`);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const description = xmlDoc.getElementsByTagName("description")[0].textContent || '';
      return { description };
    } catch (error) {
      throw new Error(`Failed to load description ${error}`);
    }
  }
}
