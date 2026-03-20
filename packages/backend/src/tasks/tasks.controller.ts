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
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreatedTaskDto, UpdatedTaskDto, GetTasksDto } from '../models/task';
import { ApiTags, ApiHeader, ApiOperation } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  getAll(@Query() query: GetTasksDto) {
    return this.tasksService.getAll(query);
  }

  @ApiHeader({ name: 'x-user-id', required: true })
  @ApiHeader({ name: 'x-user-role', required: true })
  @Post()
  async createTask(
    @Body() task: CreatedTaskDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    return await this.tasksService.createTask(task, {
      id: +userId,
      role: userRole,
    });
  }

  @ApiHeader({ name: 'x-user-id', required: true })
  @ApiHeader({ name: 'x-user-role', required: true })
  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdatedTaskDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tasksService.updateTaskById(id, task, {
      id: +userId,
      role: userRole,
    });
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task updated successfully',
      user: result,
    };
  }

  @ApiHeader({ name: 'x-user-id', required: true })
  @ApiHeader({ name: 'x-user-role', required: true })
  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    const result = await this.tasksService.deleteTaskById(id, {
      id: +userId,
      role: userRole,
    });
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task deleted successfully',
      user: result,
    };
  }

  @Get(':id')
  async getTask(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tasksService.getTaskById(id);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return result;
  }
}
