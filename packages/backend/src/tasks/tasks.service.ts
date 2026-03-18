import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import { CreatedTaskType, TaskType, UpdatedTaskType } from '../models/task';
import { DBService } from '../db/db.service';

@Injectable()
export class TasksService {
  constructor(private prisma: DBService) {}

  private readonly logger = new Logger(TasksService.name);

  async getAll(query: {
    tagIds?: string[] | string;
    status?: 'draft' | 'published';
    authorIds?: string[] | string;
    page?: string | number;
    limit?: string | number;
  }) {
    const tagIdsArr = [query.tagIds].flat().filter(Boolean).map(Number);
    const authorIdsArr = [query.authorIds].flat().filter(Boolean).map(Number);
    const page = +(query.page || 1);
    const limit = +(query.limit || 10);

    const tasks = await this.prisma.task.findMany({
      where: {
        status: query.status,
        authorId: authorIdsArr.length > 0 ? { in: authorIdsArr } : undefined,
        tags:
          tagIdsArr.length > 0
            ? { some: { id: { in: tagIdsArr } } }
            : undefined,
        deletedAt: null,
      },
      include: { tags: true, author: true, comments: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    this.logger.debug('get all tasks');
    return tasks;
  }

  async createTask(
    task: CreatedTaskType,
    currentUser: { id: number; role: string },
  ) {
    if (currentUser.role !== 'admin' && currentUser.role !== 'author') {
      throw new ForbiddenException('Only authors or admins can create tasks');
    }

    const { tagIds, comment, ...taskData } = task;

    const authorId =
      currentUser.role === 'admin'
        ? +taskData.authorId || currentUser.id
        : currentUser.id;

    const createdTask = await this.prisma.task.create({
      data: {
        ...taskData,
        authorId: authorId,
        tags: tagIds
          ? { connect: tagIds.map((id) => ({ id: +id })) }
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
    this.logger.debug('add task', createdTask);

    return createdTask;
  }

  async getTaskById(id: number) {
    const taskExists = await this.prisma.task.findUnique({
      where: { id },
      include: { tags: true, author: true, comments: true },
    });
    if (!taskExists) return null;

    this.logger.debug(`get task ${id}`);
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
    this.logger.debug(`delete task ${id}`);
    return id;
  }

  async updateTaskById(
    id: number,
    taskUpdated: UpdatedTaskType,
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
          ? { set: tagIds.map((tid: number) => ({ id: +tid })) }
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
    this.logger.debug(`update task ${id}`);
    return id;
  }
}
