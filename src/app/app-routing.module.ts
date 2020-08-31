import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoShellComponent } from './modules/todo/components/todo-shell/todo-shell.component';
import { APP_BASE_HREF } from '@angular/common';

const appRoutes: Routes = [
  {
    path: '',
    component: TodoShellComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue : '/' }
  ]
})
export class AppRoutingModule { }
