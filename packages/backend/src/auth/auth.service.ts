import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from '../models/auth';

import * as argon2 from 'argon2';
import { DBService } from '../db/db.service';
import { isLoggingEnabled } from '../main';

type PassTableType = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private prisma: DBService) {}

  async signUp(signUpDto: SignUpDto) {
    isLoggingEnabled && this.logger.debug('Trying to sign up: ', signUpDto.email);
    const UserExists = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });
    if (UserExists) throw new ConflictException('User already exists');
    const hashedPassword = await argon2.hash(signUpDto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        password: hashedPassword,
      },
    });
    return {
      message: 'Signup successful',
      user: newUser.id,
    };
  }

  async signIn(signInDto: SignInDto) {
    isLoggingEnabled &&
      this.logger.debug('Trying to sign in: ', signInDto.email);
    const UserExists = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });
    if (!UserExists) throw new NotFoundException('User not found');
    if (UserExists.status === 'blocked') {
      throw new UnauthorizedException('User is blocked');
    }
    const isPasswordMatching = await argon2.verify(
      UserExists.password,
      signInDto.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return {
      message: 'Login successful',
      user: UserExists.id,
    }
  }
}
