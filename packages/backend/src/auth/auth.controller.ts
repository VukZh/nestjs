import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../models/auth';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth-guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('signin')
  async login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Req()
    req: Request & {
      user: { id: number; role: string; email: string };
    },
  ) {
    return req.user;
  }
}
