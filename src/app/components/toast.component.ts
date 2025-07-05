import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast">
      <span>{{ data.message }}</span>
      <button
        aria-label="Закрыть"
        class="close-btn"
        (click)="snackBarRef.dismiss()"
      >
        ✖
      </button>
    </div>
  `,
  styles: [
    `
      .toast {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        color: #fff;
      }
      .close-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
      }
    `,
  ],
})
export class ToastComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string },
    public snackBarRef: MatSnackBarRef<ToastComponent>
  ) {}
}
