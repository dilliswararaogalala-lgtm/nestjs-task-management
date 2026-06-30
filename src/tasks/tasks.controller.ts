import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './dto/task.entity';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    this.logger.verbose(`GET /tasks - filters: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getAllTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    this.logger.verbose(`GET /tasks/${id}`);
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.verbose(`POST /tasks - body: ${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id') id: string): Promise<void> {
    this.logger.verbose(`DELETE /tasks/${id}`);
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    this.logger.verbose(
      `PATCH /tasks/${id}/status - body: ${JSON.stringify(updateTaskDto)}`,
    );
    const { status } = updateTaskDto;
    return this.tasksService.updateTask(id, status);
  }
}
