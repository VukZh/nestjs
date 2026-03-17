import { Injectable, Logger } from '@nestjs/common';
import { CreatedUserType, UpdatedUserType, UserType } from '../models/user';
import { DBService } from '../db/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DBService) {}

  private readonly logger = new Logger(UsersService.name);

  async getAll() {
    const users = await this.prisma.user.findMany();
    this.logger.debug('get all users');
    return users;
  }
  async createUser(user: CreatedUserType) {
    const createdUser = await this.prisma.user.create({
      data: { ...user, deletedAt: null },
    });
    this.logger.debug('add user', user);

    return createdUser;
  }
  async getUserById(id: number) {
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if (!userExists) return null;

    this.logger.debug(`get user ${id}`);
    return userExists;
  }
  async deleteUserById(id: number) {
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if (!userExists) return null;

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date().toISOString() },
    });

    this.logger.debug(`delete user ${id}`);
    return id;
  }
  async updateUserById(id: number, userUpdated: UpdatedUserType) {
    // const userExists = this.users.some((user) => user?.id === id);
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if (!userExists) return null;

    const { ...dataToUpdated } = userUpdated;

    await this.prisma.user.update({
      where: { id },
      data: {
        ...dataToUpdated,
        updatedAt: new Date(),
      },
    });
    this.logger.debug(`update user ${id}`);
    return id;
  }
}
