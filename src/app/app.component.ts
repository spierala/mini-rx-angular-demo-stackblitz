import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from './model/filter';
import { Todo } from './model/todo';
import { TodosStateService } from './services/todos-state.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todosDone$: Observable<Todo[]> = this.todosService.todosDone$;
  todosNotDone$: Observable<Todo[]> = this.todosService.todosNotDone$;
  selectedTodo$: Observable<Todo> = this.todosService.selectedTodo$;
  filter$: Observable<Filter> = this.todosService.filter$;

  constructor(private todosService: TodosStateService) {}

  selectTodo(todo: Todo) {
    this.todosService.selectTodo(todo);
  }

  addTodo() {
    this.todosService.initNewTodo();
  }

  onFilterUpdate(filter: Filter) {
    this.todosService.updateFilter(filter);
  }
}
