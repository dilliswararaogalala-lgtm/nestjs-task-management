import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

@Controller('tasks')
export class TasksController {
    private readonly logger = new Logger(TasksController.name);

    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
    }

    @Post()
    createTasks(@Body("title") title, @Body("description") description){
        this.logger.log(`Creating a new task. Title: ${title}, Description: ${description}`);
    }
}
