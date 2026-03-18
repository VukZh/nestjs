import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { TasksService } from "./tasks.service";
import { CreatedTaskType, TaskType, UpdatedTaskType } from '../models/task';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(
    @Query('tagIds') tagIds?: string | string[],
    @Query('authorIds') authorIds?: string | string[],
    @Query('status') status?: 'draft' | 'published',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tasksService.getAll({
      tagIds,
      authorIds,
      status,
      page,
      limit,
    });
  }

  @Post()
  async createTask(
    @Body() task: CreatedTaskType,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    return await this.tasksService.createTask(task, { id: +userId, role: userRole });
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() task: UpdatedTaskType,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tasksService.updateTaskById(+id, task, { id: +userId, role: userRole });
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task updated successfully',
      user: result,
    };
  }

  @Delete(':id')
  async deleteTask(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tasksService.deleteTaskById(+id, { id: +userId, role: userRole });
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task deleted successfully',
      user: result,
    };
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    const result = await this.tasksService.getTaskById(+id);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return result;
  }
}
