import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private allowUserRegistration: string
  private userRegistrationPassId: string

  constructor(private jwtService: JwtService, private prisma: PrismaService, private configService: ConfigService) {
    this.allowUserRegistration = this.configService.get<string>('ALLOW_USER_REGISTRATION', "false");
    this.userRegistrationPassId = this.configService.get<string>('USER_REGISTRATION_PASSID');
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(passid: string, username: string, password: string) {
    if (this.allowUserRegistration != "true") {
      throw new BadRequestException("No User Registration Approved.")
    }

    if (passid != this.userRegistrationPassId) {
      throw new BadRequestException("Not Acceptable passid")
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }
}
