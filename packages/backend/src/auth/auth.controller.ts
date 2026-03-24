import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../models/auth';
import { Throttle } from '@nestjs/throttler';

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
    console.log(signInDto);
    return this.authService.signIn(signInDto);
  }
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
