import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TaskFormComponent } from './task-form.component';
import { Task } from '../model/task.model';
import { ApiService } from '../services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [TaskFormComponent, MatProgressSpinnerModule, NgIf],
  template: `
    <div class="form-container">
      <app-task-form
        title="Добавить задачу"
        (save)="addTask($event)"
      ></app-task-form>
      <div class="spinner-wrapper" *ngIf="saving()">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="50"
        ></mat-progress-spinner>
      </div>
    </div>
  `,
  styles: [
    `
      .form-container {
        max-width: 600px;
        margin: 40px auto;
        padding: 32px;
        background: #fafafa;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', Tahoma, sans-serif;
      }
      .spinner-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }
    `,
  ],
})
export class AddTaskComponent {
  private router = inject(Router);
  private api = inject(ApiService);
  private snackbar = inject(MatSnackBar);

  saving = signal(false);

  async addTask(newTask: Task) {
    this.saving.set(true);
    try {
      await this.api.addTask(newTask);
      this.snackbar.open('Задача успешно добавлена', '✖', {
        duration: 3000,
        panelClass: 'snackbar-success',
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
      this.router.navigate(['/tasks']);
    } catch (e) {
      this.snackbar.open('Ошибка при добавлении задачи', '✖', {
        duration: 3000,
        panelClass: 'snackbar-error',
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    } finally {
      this.saving.set(false);
    }
  }
}
