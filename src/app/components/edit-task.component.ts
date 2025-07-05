import {
  Component,
  Input,
  inject,
  resource,
  computed,
  signal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { TaskFormComponent } from './task-form.component';
import { ApiService } from '../services/api.service';
import { Task } from '../model/task.model';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [TaskFormComponent, MatProgressSpinnerModule, NgIf],
  template: `
    <div class="form-container">
      <mat-progress-spinner
        *ngIf="loading()"
        mode="indeterminate"
        diameter="50"
      ></mat-progress-spinner>
      <app-task-form
        *ngIf="taskResource.value() as task"
        [title]="'Редактирование задачи'"
        [task]="task"
        (save)="updateTask($event)"
      ></app-task-form>
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
      mat-progress-spinner {
        display: block;
        margin: 32px auto;
      }
    `,
  ],
})
export class EditTaskComponent {
  @Input({ required: true }) id!: string;
  private router = inject(Router);
  private apiService = inject(ApiService);
  private snackbar = inject(MatSnackBar);

  saving = signal(false);
  taskResource = resource({
    request: () => this.id,
    loader: ({ request: id }) => this.apiService.getTask(id),
  });
  loading = computed(() => this.taskResource.isLoading() || this.saving());

  async updateTask(task: Task) {
    this.saving.set(true);
    try {
      await this.apiService.updateTask(task);
      this.showToast('Задача обновлена', 'snackbar-info');
      this.router.navigate(['/tasks']);
    } catch {
      this.showToast('Ошибка при обновлении задачи', 'snackbar-error');
    } finally {
      this.saving.set(false);
    }
  }

  private showToast(message: string, panelClass: string = 'snackbar-info') {
    this.snackbar.openFromComponent(ToastComponent, {
      data: { message },
      duration: 3000,
      panelClass,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
