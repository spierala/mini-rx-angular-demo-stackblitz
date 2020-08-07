import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { Todo } from './model/todo';
import { Filter } from './model/filter';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodosApiService } from './todos-api.service';

interface TodoState {
  todos: Todo[];
  selectedTodoId: number;
  filter: Filter;
}

const initialState: TodoState = {
  todos: [],
  selectedTodoId: undefined,
  filter: {
    search: '',
    category: {
      isBusiness: false,
      isPrivate: false,
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class TodosDiyService extends StateService<TodoState> {
  private todosFiltered$: Observable<Todo[]> = this.select((state) => {
    return getTodosFiltered(state.todos, state.filter);
  });
  todosDone$: Observable<Todo[]> = this.todosFiltered$.pipe(
    map((todos) => todos.filter((todo) => todo.isDone))
  );
  todosNotDone$: Observable<Todo[]> = this.todosFiltered$.pipe(
    map((todos) => todos.filter((todo) => !todo.isDone))
  );
  filter$: Observable<Filter> = this.select((state) => state.filter);
  selectedTodo$: Observable<Todo> = this.select((state) =>
    state.todos.find((item) => item.id === state.selectedTodoId)
  );

  constructor(private apiService: TodosApiService) {
    super(initialState);
    this.load();
  }

  selectTodo(todo: Todo) {
    this.setState({ selectedTodoId: todo.id });
  }

  initNewTodo() {
    this.setState({ selectedTodoId: 0 });
  }

  clearSelectedTodo() {
    this.setState({ selectedTodoId: undefined });
  }

  updateFilter(filter: Filter) {
    this.setState({
      filter: {
        ...this.state.filter,
        ...filter,
      },
    });
  }

  load() {
    this.apiService.getTodos().subscribe((todos) => this.setState({ todos }));
  }

  create(todo: Todo) {
    this.apiService.createTodo(todo).subscribe((newTodo) => {
      this.setState({
        todos: [...this.state.todos, newTodo],
        selectedTodoId: newTodo.id,
      });
    });
  }

  update(todo: Todo) {
    this.apiService.updateTodo(todo).subscribe((updatedTodo) => {
      this.setState({
        todos: this.state.todos.map((item) => (item.id === todo.id ? updatedTodo : item)),
      });
    });
  }

  delete(todo: Todo) {
    this.apiService.deleteTodo(todo).subscribe(() => {
      this.setState({
        selectedTodoId: undefined,
        todos: this.state.todos.filter((item) => item.id !== todo.id),
      });
    });
  }
}

function getTodosFiltered(todos, filter): Todo[] {
  return todos.filter((item) => {
    return (
      item.title.toUpperCase().indexOf(filter.search.toUpperCase()) > -1 &&
      (filter.category.isBusiness ? item.isBusiness : true) &&
      (filter.category.isPrivate ? item.isPrivate : true)
    );
  });
}
