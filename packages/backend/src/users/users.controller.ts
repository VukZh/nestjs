import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Headers,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from "./users.service";
import { CreatedUserDto, UpdatedUserDto } from '../models/user';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  getAll() {
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
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.usersService.updateUserById(id, user, userRole);
    if (!result) throw new NotFoundException(`User ${id} not found`);
    return {
      message: 'User updated successfully',
      user: result,
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.usersService.deleteUserById(id, userRole);
    if (!result) throw new NotFoundException(`User ${id} not found`);
    return {
      message: 'User deleted successfully',
      user: result,
    }
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}
