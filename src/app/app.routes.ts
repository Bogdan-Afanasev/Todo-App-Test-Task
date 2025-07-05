import { Routes } from '@angular/router';
import { TasksListComponent } from './components/tasks-list.component';
import { AddTaskComponent } from './components/add-task.component';
import { EditTaskComponent } from './components/edit-task.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    component: TasksListComponent,
  },
  {
    path: 'tasks/add',
    component: AddTaskComponent,
  },
  {
    path: 'tasks/:id',
    component: EditTaskComponent,
  },
];
