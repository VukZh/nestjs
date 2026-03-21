import { Injectable, Logger } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../models/auth';

import * as argon2 from 'argon2';

type PassTableType = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  PassTable: PassTableType[] = [];
  private logger = new Logger(AuthService.name);
  async signUp(signUpDto: SignUpDto) {
    this.logger.debug('signUpDto');
    const hash = await argon2.hash(signUpDto.password);
    this.PassTable.push({
      email: signUpDto.email,
      password: hash,
    });
    return {
      message: 'Signup successful:' + hash,
    };
  }

  async signIn(signInDto: SignInDto) {
    this.logger.debug('SignInDto');
    const user = this.PassTable.find((u) => u.email === signInDto.email);
    if (!user) return { message: 'User not found' };
    const isPasswordMatching = await argon2.verify(
      user.password,
      signInDto.password,
    );
    if (!isPasswordMatching) return { message: 'Invalid credentials' };
    return { message: 'Login successful' };
  }
}
