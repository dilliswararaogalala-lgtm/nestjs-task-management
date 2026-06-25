import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
    return (
      this.tasks.find((task) => task.id === id) || {
        id: 'not found',
        title: 'not found',
        description: 'not found',
        status: TaskStatus.OPEN,
      }
    );
  }

  deleteTask(id: string): void {
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

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    Object.assign(task, updateTaskDto);
    return task;
  }
}
