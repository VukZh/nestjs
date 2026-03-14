import { Injectable, Logger } from '@nestjs/common';
import { CreatedUserType, UserType } from '../models/user';

@Injectable()
export class UsersService {
  private users: UserType[] = [];

  private readonly logger = new Logger(UsersService.name);

  getAll() {
    this.logger.debug('get all users');
    return this.users;
  }
  createUser(user: CreatedUserType) {
    this.users.push({
      ...user,
      id: (Math.floor(Math.random() * (1000000 - 1 + 1)) + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });
    this.logger.debug('add user', user);

    return user;
  }
  getUserById(id: string) {
    const userExists = this.users.some((user) => user?.id === id);
    if (!userExists) return null;

    this.logger.debug(`get user ${id}`);
    return this.users.find((user) => user?.id === id);
  }
  deleteUserById(id: string) {
    const userExists = this.users.some((user) => user?.id === id);
    if (!userExists) return null;

    this.users = this.users.map((user) =>
      user.id === id ? { ...user, deletedAt: new Date().toISOString() } : user,
    );

    this.logger.debug(`delete user ${id}`);

    return id;
  }
  updateUserById(id: string, userUpdated: UserType) {
    const userExists = this.users.some((user) => user?.id === id);
    if (!userExists) return null;

    this.users = this.users.map((user) =>
      user.id === id
        ? { ...userUpdated, updatedAt: new Date().toISOString() }
        : user,
    );
    this.logger.debug(`update user ${id}`);
    return id;
  }
}
