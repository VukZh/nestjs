import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
    return this.tasksService.updateTaskById(id, task);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string){
    return this.tasksService.deleteTaskById(id);
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

}
