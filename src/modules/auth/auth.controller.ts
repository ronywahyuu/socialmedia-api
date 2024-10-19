import { Body, Controller, Get, Post, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto, LoginDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('register')
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  async register(@Body() registerPayloadDto: AuthDto) {
    // return await this.authService.register();
    return await this.authService.register(registerPayloadDto);
  }

  @Post('login')
  async login(@Body() loginPayloadDto: LoginDto) {
    const user = await this.authService.validateUser(loginPayloadDto.email, loginPayloadDto.username, loginPayloadDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

 

  @Post('logout')
  async logout() {
    // return 'This action logs out a user';
  }
}
