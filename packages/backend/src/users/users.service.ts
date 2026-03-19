import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreatedUserDto, UpdatedUserDto, UserType } from '../models/user';
import { DBService } from '../db/db.service';
import { isLoggingEnabled } from "../main";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DBService) {}

  private readonly logger = new Logger(UsersService.name);

  async getAll() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
    });
    isLoggingEnabled && this.logger.debug('get all users');
    return users;
  }
  async createUser(user: CreatedUserDto) {
    const createdUser = await this.prisma.user.create({
      data: { ...user, deletedAt: null },
    });
    isLoggingEnabled && this.logger.debug('add user', user);

    return createdUser;
  }
  async getUserById(id: number) {
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if (!userExists) return null;

    isLoggingEnabled && this.logger.debug(`get user ${id}`);
    return userExists;
  }
  async deleteUserById(id: number, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admin can delete users');
    }
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if (!userExists) return null;

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    isLoggingEnabled && this.logger.debug(`delete user ${id}`);
    return id;
  }
  async updateUserById(id: number, userUpdated: UpdatedUserDto, userRole: string) {
    if (userRole !== 'admin' && (userUpdated.role || userUpdated.status)) {
        throw new ForbiddenException('Only admin can update role or status');
    }

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
    isLoggingEnabled && this.logger.debug(`update user ${id}`);
    return id;
  }
}
