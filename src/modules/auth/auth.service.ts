import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(payload: AuthDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    return this.prisma.user.create({
      data: {
        email: payload.email,
        username: payload.username,
        password: hashedPassword,
      },
    });
  }
  async validateUser(
    email: string,
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    console.log(
      'JWT_SECRET in AuthService:',
      this.configService.get<string>('JWT_SECRET'),
    );

    return {
      access_token: this.jwtService.sign(payload),
    };
  }



  async logout() {
    return 'This action logs out a user';
  }
}
