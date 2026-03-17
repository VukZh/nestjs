import { Injectable, Logger } from '@nestjs/common';

import { CreatedTaskType, TaskType, UpdatedTaskType } from '../models/task';
import { DBService } from '../db/db.service';
import { query } from 'express';

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
    q?: string;
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
      include: { tags: true, author: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    this.logger.debug('get all tasks');
    return tasks;
  }

  async createTask(task: CreatedTaskType) {
    const { tagIds, ...taskData } = task;
    const createdTask = await this.prisma.task.create({
      data: {
        ...taskData,
        authorId: +taskData.authorId,
        tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
        deletedAt: null,
      },
      include: { tags: true, author: true },
    });
    this.logger.debug('add task', createdTask);

    return createdTask;
  }

  async getTaskById(id: number) {
    const taskExists = await this.prisma.task.findUnique({ where: { id } });
    if (!taskExists) return null;

    this.logger.debug(`get task ${id}`);
    return taskExists;
  }

  async deleteTaskById(id: number) {
    const taskExists = await this.prisma.task.findUnique({ where: { id } });
    if (!taskExists) return null;

    await this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date().toISOString() },
    });
    this.logger.debug(`delete task ${id}`);
    return id;
  }

  async updateTaskById(id: number, taskUpdated: UpdatedTaskType) {
    const taskExists = await this.prisma.task.findUnique({ where: { id } });
    if (!taskExists) return null;

    const {
      tagIds,
      authorId,
      ...dataToUpdated
    } = taskUpdated;

    await this.prisma.task.update({
      where: { id },
      data: {
        ...dataToUpdated,
        updatedAt: new Date(),
        tags: tagIds
          ? { set: tagIds.map((tid: number) => ({ id: +tid })) }
          : undefined,
      },
    });
    this.logger.debug(`update task ${id}`);
    return id;
  }
}
