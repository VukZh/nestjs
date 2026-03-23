import { Injectable, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import * as dotenv from 'dotenv';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

const SECRET = process.env.AUTH_SECRET;

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
