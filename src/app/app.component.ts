import { Component, VERSION } from '@angular/core';
import { TodosService, Todo } from './todos.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  todos$: Observable<Todo[]> = this.todosService.todos$;
  selectedTodo$: Observable<Todo> = this.todosService.selectedTodo$; 
  title$: Observable<string> = this.todosService.title$;

  constructor(
    private todosService: TodosService
  ) {

  }

  loadTodos() {
    this.todosService.load();
  }

  selectTodo(todo: Todo) {
    this.todosService.selectTodo(todo);
  }
}
