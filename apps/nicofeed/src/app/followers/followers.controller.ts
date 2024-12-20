import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowersService } from './followers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import * as puppeteer from 'puppeteer';
import * as readline from 'readline';
import { Readable } from 'stream';
import { RssService } from '../rss/rss.service';

interface PuppeteerCookieParam extends puppeteer.Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  size: number;
  session: boolean;
}

@Controller('followers')
@UseGuards(JwtAuthGuard)
export class FollowersController {
  constructor(
    private followersService: FollowersService,
    private rssService: RssService
  ) {}

  @Get()
  getFollowers(@Req() req) {
    return this.followersService.getFollowers(req.user.id);
  }

  @Get('/recent')
  getRecentUploadedFollowers(@Req() req) {
    return this.followersService.getRecentUploadedFollowers(req.user.id);
  }

  @Delete(':id')
  deleteFollower(@Param('id', ParseIntPipe) id: number) {
    return this.followersService.deleteFollower(id);
  }

  @Post('/sync/cookies')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async fetchFollowers(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const cookies = await this.parseCookies(file.buffer);
    const data = await this.fetchDataWithCookies(cookies);
    await this.followersService.syncFollowers(req.user.id, data);
    await this.rssService.fetchVideos();
    return { data };
  }

  @Post('/sync/cookies/string')
  @UseGuards(JwtAuthGuard)
  async fetchFollowersWithString(@Req() req) {
    const cookiesString = req.body.cookies;
    if (!cookiesString) {
      throw new BadRequestException('No cookies string provided');
    }

    const cookies = await this.parseCookies(Buffer.from(cookiesString));
    const data = await this.fetchDataWithCookies(cookies);
    await this.followersService.syncFollowers(req.user.id, data);
    await this.rssService.fetchVideos();
    return { data };
  }

  private async parseCookies(buffer: Buffer) {
    const cookies = [];
    const stream = Readable.from(buffer.toString());
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line.startsWith('#') && line.trim()) {
        const parts = line.split('\t');
        cookies.push({
          domain: parts[0],
          name: parts[5],
          value: parts[6],
          path: parts[2],
          expires: parts[4] ? parseInt(parts[4], 10) : 0,
          httpOnly: parts[3] === 'TRUE',
          secure: parts[1] === 'TRUE',
          size: 0,
          session: false,
        });
      }
    }
    return cookies;
  }

  private async fetchDataWithCookies(cookies: PuppeteerCookieParam[]) {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto('https://www.nicovideo.jp/my/follow', {
      waitUntil: 'networkidle2',
    });

    while ((await page.$('.ShowMoreList-more')) !== null) {
      await page.click('.ShowMoreList-more');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    const users = await page.evaluate(() => {
      const userElements = document.querySelectorAll('.UserItem');
      return Array.from(userElements).map((userElement) => {
        const nickname =
          userElement.querySelector('.UserItem-nickname')?.textContent || '';

        const href =
          (userElement.querySelector('.UserItem-link') as HTMLAnchorElement)
            ?.href || '';
        const userId = href.match(/\/user\/(\d+)\?/)?.[1] || '';
        return { userId, nickname };
      });
    });

    await browser.close();
    return users;
  }
}
