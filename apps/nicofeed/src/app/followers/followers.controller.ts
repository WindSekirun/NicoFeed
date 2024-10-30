import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowersService } from './followers.service';

@Controller('followers')
// @UseGuards(JwtAuthGuard)
export class FollowersController {
  constructor(private followersService: FollowersService) {}

  @Get()
  getFollowers(@Req() req) {
    return this.followersService.getFollowers(req.user.id);
  }

  @Post()
  addFollower(@Req() req, @Body() followerData) {
    return this.followersService.addFollower(req.user.id, followerData);
  }

  @Delete(':id')
  deleteFollower(@Param('id') id: number) {
    return this.followersService.deleteFollower(id);
  }
}
