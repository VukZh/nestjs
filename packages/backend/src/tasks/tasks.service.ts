import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import {
  CreatedTaskDto,
  TaskType,
  UpdatedTaskDto,
  GetTasksDto,
} from '../models/task';
import { DBService } from '../db/db.service';
import { isLoggingEnabled } from '../main';

@Injectable()
export class TasksService {
  constructor(private prisma: DBService) {}

  private readonly logger = new Logger(TasksService.name);

  async getAll(query: GetTasksDto) {
    const { tagIds, authorIds, status, page = 1, limit = 10 } = query;

    const tasks = await this.prisma.task.findMany({
      where: {
        status: status,
        authorId:
          authorIds && authorIds.length > 0 ? { in: authorIds } : undefined,
        tags:
          tagIds && tagIds.length > 0
            ? { some: { id: { in: tagIds } } }
            : undefined,
        deletedAt: null,
      },
      include: { tags: true, author: true, comments: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    isLoggingEnabled && this.logger.debug('get all tasks');
    return tasks;
  }

  async createTask(
    task: CreatedTaskDto,
    currentUser: { id: number; role: string },
  ) {
    if (currentUser.role !== 'admin' && currentUser.role !== 'author') {
      throw new ForbiddenException('Only authors or admins can create tasks');
    }

    const { tagIds, comment, ...taskData } = task;

    const authorId =
      currentUser.role === 'admin'
        ? taskData.authorId || currentUser.id
        : currentUser.id;

    const createdTask = await this.prisma.task.create({
      data: {
        ...taskData,
        authorId: authorId,
        tags: tagIds
          ? { connect: tagIds.map((id) => ({ id: id })) }
          : undefined,
        comments: comment
          ? {
              create: {
                content: comment,
                status: 'visible',
                author: { connect: { id: authorId } },
              },
            }
          : undefined,
        deletedAt: null,
      },
      include: { tags: true, author: true, comments: true },
    });
    isLoggingEnabled && this.logger.debug('add task', createdTask);

    return createdTask;
  }

  async getTaskById(id: number) {
    const taskExists = await this.prisma.task.findUnique({
      where: { id },
      include: { tags: true, author: true, comments: true },
    });
    if (!taskExists) return null;

    isLoggingEnabled && this.logger.debug(`get task ${id}`);
    return taskExists;
  }

  async deleteTaskById(id: number, currentUser: { id: number; role: string }) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) return null;

    if (currentUser.role !== 'admin' && task.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    isLoggingEnabled && this.logger.debug(`delete task ${id}`);
    return id;
  }

  async updateTaskById(
    id: number,
    taskUpdated: UpdatedTaskDto,
    currentUser: { id: number; role: string },
  ) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) return null;

    if (currentUser.role !== 'admin' && task.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    const { tagIds, authorId, comment, ...dataToUpdated } = taskUpdated;

    await this.prisma.task.update({
      where: { id },
      data: {
        ...dataToUpdated,
        updatedAt: new Date(),
        tags: tagIds
          ? { set: tagIds.map((tid: number) => ({ id: tid })) }
          : undefined,
        comments: comment
          ? {
              create: {
                content: comment,
                status: 'visible',
                author: { connect: { id: currentUser.id } },
              },
            }
          : undefined,
      },
    });
    isLoggingEnabled && this.logger.debug(`update task ${id}`);
    return id;
  }
}
