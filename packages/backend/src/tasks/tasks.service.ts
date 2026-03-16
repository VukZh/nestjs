import { Injectable, Logger } from '@nestjs/common';

import { CreatedTaskType, TaskType } from '../models/task';
import { DBService } from '../db/db.service';

@Injectable()
export class TasksService {
  constructor(private prisma: DBService) {}

  private readonly logger = new Logger(TasksService.name);

  async getAll() {
    const tasks = await this.prisma.task.findMany();
    this.logger.debug('get all tasks');
    return tasks;
  }

  async createTask(task: CreatedTaskType) {
    const createdTask = await this.prisma.task.create({
      data: {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
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

  async updateTaskById(id: number, taskUpdated: TaskType) {
    const taskExists = await this.prisma.task.findUnique({ where: { id } });
    if (!taskExists) return null;

    await this.prisma.task.update({
      where: { id },
      data: {
        ...taskUpdated,
        id: +taskUpdated.id!,
        updatedAt: new Date().toISOString(),
      },
    });
    this.logger.debug(`update task ${id}`);
    return id;
  }
}
