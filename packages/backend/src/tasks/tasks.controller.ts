import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from "./tasks.service";
import { CreatedTaskType, TaskType } from "../models/task";

@Controller('tasks')
export class TasksController {

  constructor(private readonly tasksService: TasksService) {
  }

  @Get()
  getAll() {
    return this.tasksService.getAll();
  }

  @Post()
  createTask(@Body() task: CreatedTaskType) {
    return this.tasksService.createTask(task);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() task: TaskType) {
    const result = this.tasksService.updateTaskById(+id, task);
    if (!result) throw new NotFoundException(`Task ${id} not found`);
    return {
      message: 'Task updated successfully',
      user: result,
    };
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string){
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
