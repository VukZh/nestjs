import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from "./users.service";
import { CreatedUserType, UserType } from '../models/user';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Post()
  createUser(@Body() user: CreatedUserType) {
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() user: UserType) {
    const result = this.usersService.updateUserById(+id, user);
    if (!result) throw new NotFoundException(`User ${id} not found`);
    return {
      message: 'User updated successfully',
      user: result,
    }
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const result = this.usersService.deleteUserById(+id);
    if (!result) throw new NotFoundException(`User ${id} not found`);
    return {
      message: 'User deleted successfully',
      user: result,
    }
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    const result = this.usersService.getUserById(+id);
    if (!result) throw new NotFoundException(`User ${id} not found`);
    return result;
  }
}
