import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(filterDto?: GetTasksFilterDto): Task[] {
    let tasks = this.tasks;

    if (filterDto?.status) {
      tasks = tasks.filter((task) => task.status === filterDto.status);
    }

    if (filterDto?.search) {
      const search = filterDto.search.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const foundedTask = this.tasks.find((task) => task.id === id);
    if (!foundedTask) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return foundedTask;
  }

  deleteTask(id: string): void {
    this.getTaskById(id); // Check if the task exists, will throw NotFoundException if not found
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
