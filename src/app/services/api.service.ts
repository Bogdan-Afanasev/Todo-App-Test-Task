import { Injectable } from '@angular/core';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private delay = 500; // Можно сделать чуть меньше задержку
  private storageKey = 'tasksStorage';

  private tasks: Task[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.tasks = JSON.parse(saved) as Task[];
      } catch {
        this.tasks = [];
      }
    } else {
      // Если в хранилище пусто — загружаем начальные данные
      this.tasks = [
        {
          id: '1',
          title: ' УТРОМ',
          description: 'ПРЕСС КАЧАТ',
          status: 'Не выполнена',
        },
        {
          id: '2',
          title: 'Т',
          description: 'БЕГИТ',
          status: 'Не выполнена',
        },
        {
          id: '3',
          title: 'ТУРНИК',
          description: '',
          status: 'Выполнена',
        },
        {
          id: '4',
          title: 'АНЖУМАНЯ',
          description: 'ВЕЧЕРОМ',
          status: 'В процессе',
        },
        {
          id: '5',
          title: 'ВЕЧЕРОМ',
          description: 'ПРЕСС КАЧАТ',
          status: 'Выполнена',
        },
        {
          id: '6',
          title: 'БЕГИТ',
          description: '',
          status: 'Не выполнена',
        },
        {
          id: '7',
          title: 'ТУРНИК',
          description: '',
          status: 'Выполнена',
        },
        {
          id: '8',
          title: 'АНЖУМАНЯ',
          description: 'ВЕЧЕРОМ',
          status: 'В процессе',
        },
      ];
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  private generateUniqueId(): string {
    const existingIds = this.tasks.map((c) => parseInt(c.id, 10));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return (maxId + 1).toString();
  }

  async getTasks(): Promise<Task[]> {
    await this.simulateDelay();
    return [...this.tasks];
  }

  async addTask(task: Task): Promise<Task> {
    await this.simulateDelay();
    const newTask = {
      ...task,
      id: this.generateUniqueId(),
    };
    this.tasks = [newTask, ...this.tasks];
    this.saveToStorage();
    return newTask;
  }

  async deleteTask(id: string): Promise<void> {
    await this.simulateDelay();
    this.tasks = this.tasks.filter((c) => c.id !== id);
    this.saveToStorage();
  }

  async updateTask(updatedTask: Task): Promise<Task> {
    await this.simulateDelay();
    const index = this.tasks.findIndex((c) => c.id === updatedTask.id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks[index] = updatedTask;
    this.saveToStorage();
    return updatedTask;
  }

  async getTask(id: string): Promise<Task> {
    await this.simulateDelay();
    const task = this.tasks.find((c) => c.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }
}
