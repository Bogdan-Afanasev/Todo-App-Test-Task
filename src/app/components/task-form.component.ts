import { Component, input, linkedSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgIf, NgFor } from '@angular/common';
import { Task } from '../model/task.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
    NgIf,
    NgFor,
  ],
  template: `
    <form class="container" (ngSubmit)="onSubmit()" #form="ngForm">
      <h2>{{ title() }}</h2>
      <div class="fields">
        <mat-form-field
          appearance="outline"
          class="form-field"
          [hideRequiredMarker]="true"
        >
          <mat-label>Название</mat-label>
          <input
            matInput
            [(ngModel)]="titleField"
            name="title"
            required
            #titleInput="ngModel"
          />
          <mat-error *ngIf="titleInput.invalid && titleInput.touched">
            Обязательное поле
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Описание</mat-label>
          <input matInput [(ngModel)]="description" name="description" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Статус</mat-label>
          <mat-select [(ngModel)]="status" name="status">
            <mat-option *ngFor="let st of statuses" [value]="st">
              {{ st }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="actions">
        <button class="btn-flat" type="submit" [disabled]="form.invalid">
          Сохранить
        </button>
        <button class="btn-outline" type="button" routerLink="/tasks">
          Отмена
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
      }
      .fields {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .form-field {
        width: 100%;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }

      input[type='text'],
      mat-select {
        width: 100%;
      }

      .btn-flat {
        background-color: #333;
        color: #fff;
        padding: 10px 24px;
        border-radius: 6px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .btn-flat:hover {
        background-color: #555;
      }
      .btn-outline {
        background: transparent;
        border: 1.5px solid #555;
        padding: 10px 24px;
        color: #555;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      .btn-outline:hover {
        background-color: #eee;
        color: #222;
      }
      ::ng-deep .mat-form-field-required-marker {
        display: none !important;
      }
    `,
  ],
})
export class TaskFormComponent {
  statuses = [
    'Не выполнена',
    'В процессе',
    'Отменена',
    'Отложена',
    'Выполнена',
  ];

  title = input<string>('');
  task = input<Task>();

  titleField = linkedSignal(() => this.task()?.title ?? '');
  description = linkedSignal(() => this.task()?.description ?? '');
  status = linkedSignal(() => this.task()?.status ?? 'Не выполнена');

  save = output<Task>();

  onSubmit() {
    this.save.emit({
      id: this.task()?.id ?? '',
      title: this.titleField(),
      description: this.description(),
      status: this.status(),
    });
  }
}
