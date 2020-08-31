import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo';
import { Filter } from '../../models/filter';
import { TodosStateService } from '../../services/todos-state.service';

@Component({
  selector: 'app-todo-shell',
  templateUrl: './todo-shell.component.html',
  styleUrls: ['./todo-shell.component.css']
})
export class TodoShellComponent {

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
