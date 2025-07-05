import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../model/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    NgIf,
    NgFor,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="filters">
      <input
        type="text"
        placeholder="Поиск по названию"
        [value]="searchTerm()"
        (input)="onSearchInput($event)"
        class="search-input"
      />

      <mat-form-field appearance="outline" class="status-filter">
        <mat-label>Фильтр по статусу</mat-label>
        <mat-select
          [value]="statusFilter()"
          (selectionChange)="onStatusFilterChange($event.value)"
        >
          <mat-option value="">Все статусы</mat-option>
          <mat-option *ngFor="let status of statuses" [value]="status">
            {{ status }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div class="card" *ngFor="let task of filteredTasks(); trackBy: trackById">
      <div class="content">
        <div class="title" title="{{ task.title }}">
          {{ task.title }}
        </div>
        <div class="description" title="{{ task.description }}">
          {{ task.description }} | {{ task.status }}
        </div>
      </div>

      <div class="actions">
        <button
          mat-icon-button
          class="icon-button edit-button"
          [routerLink]="['/tasks', task.id]"
          aria-label="Редактировать"
        >
          <mat-icon>edit_note</mat-icon>
        </button>

        <button
          mat-icon-button
          class="icon-button delete-button"
          aria-label="Удалить"
          (click)="confirmDelete(task)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </div>

    <div class="spinner-wrapper" *ngIf="loading()">
      <div class="spinner">Загрузка...</div>
    </div>

    <div class="modal-backdrop" *ngIf="deleteConfirmVisible()">
      <div class="modal">
        <h2>Удалить задачу?</h2>
        <p>
          Точно хотите удалить задачу "<strong>{{
            taskToDelete()?.title
          }}</strong
          >"?
        </p>
        <div class="modal-actions">
          <button class="btn-cancel" (click)="cancelDelete()">Отмена</button>
          <button class="btn-delete" (click)="deleteTaskConfirmed()">
            Удалить
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: 'Segoe UI', sans-serif;
        padding: 16px;
        max-width: 900px;
        margin: auto;
        background: #fefefe;
      }

      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;
        align-items: stretch;
      }

      .search-input {
        flex: 1 1 280px;
        padding: 0 12px;
        font-size: 16px;
        border: 1px solid #bbb;
        border-radius: 6px;
        background-color: #fff;
        color: #000;
        height: 56px;
        box-sizing: border-box;
      }

      .status-filter {
        width: 200px;
        display: flex;
        align-items: stretch;
      }

      .card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border: 1.5px solid #000;
        border-radius: 12px;
        padding: 12px 16px;
        margin-bottom: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        min-height: 64px;
      }

      .content {
        flex: 1;
        overflow: hidden;
        padding-right: 16px;
      }

      .title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #000;
      }

      .description {
        font-size: 14px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .icon-button {
        color: #000;
        transition: color 0.3s ease;
      }

      .edit-button:hover mat-icon {
        color: #444;
      }

      .delete-button:hover mat-icon {
        color: #d32f2f;
      }

      .spinner-wrapper {
        display: flex;
        justify-content: center;
        margin: 32px 0;
      }

      .spinner {
        font-size: 18px;
        color: #333;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal {
        background: #fff;
        border-radius: 12px;
        padding: 24px 32px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      .modal h2 {
        margin-top: 0;
        margin-bottom: 12px;
        font-weight: 700;
        font-size: 22px;
      }

      .modal p {
        font-size: 16px;
        margin-bottom: 24px;
        color: #000;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .btn-cancel {
        background-color: #fff;
        color: #000;
        border: 1px solid #000;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .btn-cancel:hover {
        background-color: #f0f0f0;
      }

      .btn-delete {
        background-color: #d32f2f;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .btn-delete:hover {
        background-color: #b71c1c;
      }
    `,
  ],
})
export class TasksListComponent {
  private apiService = inject(ApiService);
  private snackbar = inject(MatSnackBar);

  tasksResource = resource<Task[], Error>({
    loader: () => this.apiService.getTasks(),
  });

  tasks = signal<Task[]>([]);
  deleting = signal(false);
  loading = computed(() => this.deleting() || this.tasksResource.isLoading());

  searchTerm = signal('');
  statusFilter = signal('');

  statuses = [
    'Не выполнена',
    'В процессе',
    'Отменена',
    'Отложена',
    'Выполнена',
  ];

  filteredTasks = signal<Task[]>([]);
  deleteConfirmVisible = signal(false);
  private taskToDeleteSignal = signal<Task | null>(null);

  taskToDelete() {
    return this.taskToDeleteSignal();
  }

  constructor() {
    effect(() => {
      if (!this.tasksResource.isLoading() && this.tasksResource.value()) {
        this.tasks.set(this.tasksResource.value()!);
        this.applyFilter();
      }
    });

    effect(() => {
      this.searchTerm();
      this.statusFilter();
      this.applyFilter();
    });

    effect(() => {
      const err = this.tasksResource.error();
      if (err) {
        this.showToast('Ошибка при загрузке задач', 'snackbar-error');
      }
    });
  }

  onSearchInput(e: Event) {
    this.searchTerm.set((e.target as HTMLInputElement).value);
  }

  onStatusFilterChange(v: string) {
    this.statusFilter.set(v);
  }

  private applyFilter() {
    let list = this.tasks();
    const s = this.searchTerm().toLowerCase();
    if (s) list = list.filter((c) => c.title.toLowerCase().includes(s));
    const f = this.statusFilter();
    if (f) list = list.filter((c) => c.status === f);
    this.filteredTasks.set(list);
  }

  confirmDelete(c: Task) {
    this.taskToDeleteSignal.set(c);
    this.deleteConfirmVisible.set(true);
  }

  cancelDelete() {
    this.taskToDeleteSignal.set(null);
    this.deleteConfirmVisible.set(false);
  }

  async deleteTaskConfirmed() {
    const task = this.taskToDeleteSignal();
    if (!task) return;

    this.deleting.set(true);
    try {
      await this.apiService.deleteTask(task.id);
      this.tasksResource.reload();
      this.showToast('Задача удалена', 'snackbar-warning');
    } catch {
      this.showToast('Ошибка при удалении', 'snackbar-error');
    } finally {
      this.deleting.set(false);
      this.deleteConfirmVisible.set(false);
      this.taskToDeleteSignal.set(null);
    }
  }

  showToast(message: string, panelClass: string = 'snackbar-info') {
    this.snackbar.openFromComponent(ToastComponent, {
      data: { message, duration: 3000 },
      duration: 3000,
      panelClass,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  trackById(index: number, item: Task) {
    return item.id;
  }
}
