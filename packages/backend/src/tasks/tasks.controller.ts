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
  createTask(@Body() task: CreatedTaskType) {
    return this.tasksService.createTask(task);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() task: UpdatedTaskType) {
    const result = this.tasksService.updateTaskById(+id, task);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task updated successfully',
      user: result,
    };
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    const result = this.tasksService.deleteTaskById(+id);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task deleted successfully',
      user: result,
    };
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    const result = this.tasksService.getTaskById(+id);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return result;
  }
}
