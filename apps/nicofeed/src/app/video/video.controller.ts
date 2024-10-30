import { Controller, Get } from "@nestjs/common";
import { VideoService } from "./video.service";

@Controller()
export class VideoController {
    constructor(private videoService: VideoService) {}

    @Get("/video")
    async getVideoList() {
        return await this.videoService.getList();
    }
}