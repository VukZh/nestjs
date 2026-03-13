import { Injectable } from '@nestjs/common';

import { CreatedTaskType, TaskType } from '../models/task'

@Injectable()
export class TasksService {
  private tasks: TaskType[] = [];

  getAll() {
    return this.tasks
  }

  createTask(task: CreatedTaskType) {
    this.tasks.push({...task,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    });
    return task;
  }

  getTaskById(id: string) {
    return this.tasks.find(task => task.id === id);
  }

  deleteTaskById(id: string) {
    return this.tasks = this.tasks.filter(task => task.id !== id);
  }

  updateTaskById(id: string, taskUpdated: TaskType) {
    this.tasks = this.tasks.map(task =>
      task.id === id ? taskUpdated : task);
    return taskUpdated;
  }
}
