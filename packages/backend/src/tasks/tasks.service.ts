import { Injectable, Logger } from '@nestjs/common';

import { CreatedTaskType, TaskType } from '../models/task'

@Injectable()
export class TasksService {
  private tasks: TaskType[] = [];

  private readonly logger = new Logger(TasksService.name);

  getAll() {
    this.logger.debug('get all tasks');
    return this.tasks;
  }

  createTask(task: CreatedTaskType) {
    this.tasks.push({
      ...task,
      id: (Math.floor(Math.random() * (1000000 - 1 + 1)) + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });
    this.logger.debug('add task', task);

    return task;
  }

  getTaskById(id: string) {
    const taskExists = this.tasks.some((task) => task?.id === id);
    if (!taskExists) return null;

    this.logger.debug(`get task ${id}`);
    return this.tasks.find((task) => task?.id === id);
  }

  deleteTaskById(id: string) {
    const taskExists = this.tasks.some((task) => task?.id === id);
    if (!taskExists) return null;

    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, deletedAt: new Date().toISOString() } : task,
    );

    this.logger.debug(`delete task ${id}`);

    return id;  }

  updateTaskById(id: string, taskUpdated: TaskType) {
    const taskExists = this.tasks.some((task) => task?.id === id);
    if (!taskExists) return null;

    this.tasks = this.tasks.map((task) =>
      task.id === id
        ? { ...taskUpdated, updatedAt: new Date().toISOString() }
        : task,
    );
    this.logger.debug(`update task ${id}`);
    return id;
  }
}
