import { Injectable } from '@angular/core';
import { Feature } from 'mini-rx-store';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const apiUrl = 'api/todos/';

export class Todo {
  id: number;
  title: string;
  isDone: boolean;
}

interface TodoState {
  todos: Todo[];
  selectedTodoId: number;
}

const initialState: TodoState = {
  todos: [],
  selectedTodoId: undefined,
};

@Injectable({ providedIn: 'root' })
export class TodosService extends Feature<TodoState> {
  todosDone$: Observable<Todo[]> = this.select((state) =>
    state.todos.filter((item) => item.isDone)
  );
  todosNotDone$: Observable<Todo[]> = this.select((state) =>
    state.todos.filter((item) => !item.isDone)
  );
  selectedTodo$: Observable<Todo> = this.select((state) => {
    if (state.selectedTodoId === 0) {
      return new Todo();
    }
    return state.todos.find((item) => item.id === state.selectedTodoId);
  });

  constructor(private http: HttpClient) {
    super('todos', initialState);

    this.load();
  }

  selectTodo(todo: Todo) {
    this.setState({ selectedTodoId: todo.id }, 'selectTodo');
  }

  addTodo() {
    this.setState({ selectedTodoId: 0 });
  }

  clearSelectedTodo() {
    this.setState({ selectedTodoId: undefined });
  }

  // Effects
  load = this.createEffect(
    switchMap(() => this.http.get<Todo[]>(apiUrl).pipe(map((todos) => ({ todos })))),
    'load'
  );

  create = this.createEffect<Todo>(
    switchMap((todo) => {
      return this.http
        .post<Todo>(apiUrl, { ...todo, id: null }) // Product Id must be null for the Web API to assign an Id
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
}
