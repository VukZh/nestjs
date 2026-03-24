import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatedUserDto, UpdatedUserDto } from '../models/user';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import type { Request } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(@Req() req: Request & { user: { role: string } }) {
    if (req?.user?.role! !== 'admin') {
      throw new ForbiddenException('Only admin can access this resource');
    }
    return this.usersService.getAll();
  }

  @Post()
  createUser(@Body() user: CreatedUserDto) {
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdatedUserDto,
    @Req() req: Request & { user: { role: string } },
  ) {
    const result = await this.usersService.updateUserById(
      id,
      user,
      req.user.role,
    );
    if (!result) throw new NotFoundException(`User ${id} not found`);
    return {
      message: 'User updated successfully',
      user: result,
    };
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { role: string } },
  ) {
    const result = await this.usersService.deleteUserById(id, req.user.role);
    if (!result) throw new NotFoundException(`User ${id} not found`);
    return {
      message: 'User deleted successfully',
      user: result,
    };
  }
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}
