import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodosService } from './todos.service';
import { TodosData } from './todos-data';
import { HttpClientModule } from '@angular/common/http';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { NgReduxDevtoolsModule } from 'mini-rx-ng-devtools';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(TodosData, { delay: 1000, put204: false }),
    NgReduxDevtoolsModule.instrument({
      name: 'Stackblitz Angular MiniRx Todos Showcase',
      maxAge: 25,
      latency: 1000,
    }),
  ],
  declarations: [AppComponent, TodoDetailComponent, FilterComponent],
  bootstrap: [AppComponent],
  providers: [TodosService],
})
export class AppModule {}
