import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TodosData } from './modules/todo/services/api/todos-data';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TodoModule } from './modules/todo/todo.module';
import { CounterModule } from './modules/counter/counter.module';
import { NgReduxDevtoolsModule } from 'mini-rx-ng-devtools';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(TodosData, { delay: 500, put204: false }),
    AppRoutingModule,
    TodoModule,
    CounterModule,
    NgReduxDevtoolsModule.instrument({
      name: 'Stackblitz Angular MiniRx Todos Showcase',
      maxAge: 25,
      latency: 1000,
    }),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
