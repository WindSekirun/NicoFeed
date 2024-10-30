import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class VideoService {
    constructor(private prismaService: PrismaService) {}

    async getList() {
        return await this.prismaService.video.findMany({});
    }
}