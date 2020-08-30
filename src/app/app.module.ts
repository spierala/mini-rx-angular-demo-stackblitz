import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodosData } from './services/api/todos-data';
import { HttpClientModule } from '@angular/common/http';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FilterComponent } from './filter/filter.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoListComponent } from './todo-list/todo-list.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(TodosData, { delay: 500, put204: false }),
    MatSidenavModule,
  ],
  declarations: [AppComponent, TodoDetailComponent, FilterComponent, TodoListComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
