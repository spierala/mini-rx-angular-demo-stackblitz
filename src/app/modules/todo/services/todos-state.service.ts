import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Filter } from '../models/filter';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TodosApiService } from './api/todos-api.service';
import { Feature } from 'mini-rx-store';

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
export class TodosStateService extends Feature<TodoState> {
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
  selectedTodo$: Observable<Todo> = this.select((state) => {
    if (state.selectedTodoId === 0) {
      return new Todo();
    }
    return state.todos.find((item) => item.id === state.selectedTodoId);
  }).pipe(
    // Multicast to prevent multiple executions due to multiple subscribers
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(private apiService: TodosApiService) {
    super('todos', initialState);

    this.load();
  }

  selectTodo(todo: Todo) {
    this.setState({ selectedTodoId: todo.id }, 'selectTodo');
  }

  initNewTodo() {
    this.setState({ selectedTodoId: 0 }, 'initNewTodo');
  }

  clearSelectedTodo() {
    this.setState({ selectedTodoId: undefined }, 'clearSelectedTodo');
  }

  updateFilter(filter: Filter) {
    this.setState({
      filter: {
        ...this.state.filter,
        ...filter,
      },
    }, 'updateFilter');
  }

  // API CALLS
  load() {
    this.apiService.getTodos().subscribe((todos) => this.setState({ todos }, 'apiLoadSuccess'));
  }

  create(todo: Todo) {
    this.apiService.createTodo(todo).subscribe((newTodo) => {
      this.setState({
        todos: [...this.state.todos, newTodo],
        selectedTodoId: newTodo.id,
      }, 'apiCreateSuccess');
    });
  }

  update(todo: Todo) {
    this.apiService.updateTodo(todo).subscribe((updatedTodo) => {
      this.setState({
        todos: this.state.todos.map((item) => (item.id === todo.id ? updatedTodo : item)),
      }, 'apiUpdateSuccess');
    });
  }

  delete(todo: Todo) {
    this.apiService.deleteTodo(todo).subscribe(() => {
      this.setState({
        selectedTodoId: undefined,
        todos: this.state.todos.filter((item) => item.id !== todo.id),
      }, 'apiDeleteSuccess');
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
