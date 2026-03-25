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
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreatedTaskDto, UpdatedTaskDto, GetTasksDto } from '../models/task';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  getAll(@Query() query: GetTasksDto) {
    return this.tasksService.getAll(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @Body() task: CreatedTaskDto,
    @Req()
    req: Request & {
      user: { id: number; role: string };
    },
  ) {
    return await this.tasksService.createTask(task, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdatedTaskDto,
    @Req()
    req: Request & {
      user: { id: number; role: string };
    },
  ) {
    const result = await this.tasksService.updateTaskById(id, task, req.user);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task updated successfully',
      user: result,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    req: Request & {
      user: { id: number; role: string };
    },
  ) {
    const result = await this.tasksService.deleteTaskById(id, req.user);
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
