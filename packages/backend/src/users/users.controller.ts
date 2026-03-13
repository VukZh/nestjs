import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from "./users.service";
import { CreatedUserType, UserType } from '../models/user';

@Controller('users')
export class UsersController {

  constructor(private readonly users: UsersService) {
  }

  @Get()
  getAll() {
    return this.users.getAll();
  }

  @Post()
  createUser(@Body() user: CreatedUserType) {
    return this.users.createUser(user);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() user: UserType) {
    return this.users.updateUserById(id, user);
  }

  @Delete()
  deleteUser(@Param('id') id: string) {
    return this.users.deleteUserById(id);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.users.getUserById(id);
  }
}
