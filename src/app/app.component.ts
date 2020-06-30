import { Component, VERSION } from '@angular/core';
import { TodosService, Todo } from './todos.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todosDone$: Observable<Todo[]> = this.todosService.todosDone$;
  todosNotDone$: Observable<Todo[]> = this.todosService.todosNotDone$;
  selectedTodo$: Observable<Todo> = this.todosService.selectedTodo$;

  constructor(private todosService: TodosService) {}

  loadTodos() {
    this.todosService.load();
  }

  selectTodo(todo: Todo) {
    this.todosService.selectTodo(todo);
  }

  addTodo() {
    this.todosService.initNewTodo();
  }

  onFilterUpdate(filter: string) {
    this.todosService.updateFilter(filter);
  }
}
