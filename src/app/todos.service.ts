import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, Feature } from 'mini-rx-store';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, startWith, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Todo } from './model/todo';
import { Filter } from './model/filter';

const apiUrl = 'api/todos/';

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

@Injectable({ providedIn: 'root' })
export class TodosService extends Feature<TodoState> {
  todosDone$: Observable<Todo[]> = this.select(getTodosFilteredDone);
  todosNotDone$: Observable<Todo[]> = this.select(getTodosFilteredNotDone);
  selectedTodo$: Observable<Todo> = this.select(getSelectedTodo);
  filter$: Observable<Filter> = this.select(getFilter);

  // Effects
  load = this.createEffect(
    switchMap(() => this.http.get<Todo[]>(apiUrl).pipe(map((todos) => ({ todos })))),
    'load'
  );

  create = this.createEffect<Todo>(
    switchMap((todo) => {
      return this.http
        .post<Todo>(apiUrl, { ...todo })
        .pipe(
          map((newTodo) => ({
            todos: [...this.state.todos, newTodo],
            selectedTodoId: newTodo.id,
          }))
        );
    }),
    'create'
  );

  update = this.createEffect<Todo>(
    pipe(
      withLatestFrom(this.selectedTodo$), // Get snapshot of selectedTodo for undoing optimistic update
      switchMap(([todo, originalTodo]) =>
        this.http.put<Todo>(apiUrl + todo.id, todo).pipe(
          map((updatedTodo) => ({
            todos: this.state.todos.map((item) => (item.id === todo.id ? updatedTodo : item)),
          })),
          // UNDO Optimistic Update
          catchError(() =>
            of({
              todos: this.state.todos.map((item) => (item.id === todo.id ? originalTodo : item)),
            })
          ),
          // Optimistic Update
          startWith({
            todos: this.state.todos.map((item) => (item.id === todo.id ? todo : item)),
          })
        )
      )
    ),
    'update'
  );

  delete = this.createEffect<Todo>(
    switchMap((todo) =>
      this.http.delete<Todo>(apiUrl + todo.id).pipe(
        map(() => ({
          selectedTodoId: undefined,
          todos: this.state.todos.filter((item) => item.id !== todo.id),
        }))
      )
    ),
    'delete'
  );

  constructor(private http: HttpClient) {
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
    this.setState({ filter: { ...this.state.filter, ...filter } }, 'updateFilter');
  }
}

// Selectors
const getFeatureState = createFeatureSelector<TodoState>();
const getTodos = createSelector(getFeatureState, (state) => state.todos);
const getSelectedTodoId = createSelector(getFeatureState, (state) => state.selectedTodoId);
const getSelectedTodo = createSelector(getTodos, getSelectedTodoId, (todos, selectedTodoId) => {
  if (selectedTodoId === 0) {
    return new Todo();
  }
  return todos.find((item) => item.id === selectedTodoId);
});
const getFilter = createSelector(getFeatureState, (state) => state.filter);
const getTodosFiltered = createSelector(getTodos, getFilter, (todos, filter) => {
  return todos.filter((item) => {
    return (
      item.title.toUpperCase().indexOf(filter.search.toUpperCase()) > -1 &&
      (filter.category.isBusiness ? item.isBusiness : true) &&
      (filter.category.isPrivate ? item.isPrivate : true)
    );
  });
});
const getTodosFilteredDone = createSelector(getTodosFiltered, (todos) =>
  todos.filter((item) => item.isDone)
);
const getTodosFilteredNotDone = createSelector(getTodosFiltered, (todos) =>
  todos.filter((item) => !item.isDone)
);
