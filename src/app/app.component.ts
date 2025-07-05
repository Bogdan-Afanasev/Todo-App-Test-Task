import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar class="top-toolbar">
      <span class="toolbar-title">Todo App Test Task</span>
      <button
        mat-icon-button
        routerLink="tasks/add"
        aria-label="Добавить задачу"
        class="add-btn"
      >
        <mat-icon>add_circle</mat-icon>
      </button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .top-toolbar {
        background-color: #000;
        color: #fff;
        justify-content: center;
        position: relative;
        padding: 0 16px;
      }
      .toolbar-title {
        font-weight: 700;
        font-size: 20px;
      }
      .add-btn {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #fff;
        transition: color 0.3s;
      }
      .add-btn:hover {
        color: #4caf50;
      }
    `,
  ],
})
export class AppComponent {}
