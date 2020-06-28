import { Injectable } from "@angular/core";
import { Feature } from "mini-rx-store";
import { Observable } from "rxjs";
import { switchMap, concatMap, map } from "rxjs/operators";
import { HttpClientModule, HttpClient } from "@angular/common/http";

const apiUrl = 'https://my-json-server.typicode.com/spierala/todo-json-server/todos'

export class Todo {
  id: number;
  title: string;
}

interface TodoState {
  title: string;
  todos: Todo[];
  selectedTodoId: number;
}

const initialState: TodoState = {
  todos: [],
  selectedTodoId: undefined
};

@Injectable({ providedIn: "root" })
export class TodosService extends Feature<TodoState> {
  title$: Observable<string> = this.select(state => state.title);
  todos$: Observable<Todo[]> = this.select(state => state.todos);
  selectedTodo$: Observable<Todo> = this.select(state => {
    if (!state.selectedTodoId) {
      return new Todo();
    }
    return state.todos.find(item => item.id === state.selectedTodoId);
  });

  constructor(private http: HttpClient) {
    super("todos", initialState);

    this.load();
  }

  addTodo(todo: Todo) {
    this.setState({
      todos: [todo, ...this.state.todos]
    });
  }

  selectTodo(todo: Todo) {
    this.setState({ selectedTodoId: todo.id });
  }

  load = this.createEffect(
    switchMap(() =>
      this.http
        .get<Todo[]>(apiUrl)
        .pipe(map(todos => ({ todos })))
    )
  );

  create = this.createEffect<Todo>(
    switchMap(todo =>
      this.http
        .post<Todo>(apiUrl, todo)
        .pipe(map(todo => ({ todos: [...this.state.todos, todo] })))
    )
  );

  update = this.createEffect<Todo>(
    switchMap(todo =>
      this.http
        .put<Todo>(
          apiUrl + todo.id,
          todo
        )
        .pipe(
          map(todo => ({
            todos: this.state.todos.map(item =>
              item.id === todo.id ? todo : item
            )
          }))
        )
    )
  );

  delete = this.createEffect<Todo>(
    switchMap(todo =>
      this.http
        .delete<Todo>(apiUrl + todo.id)
        .pipe(
          map(() => ({
            selectedTodoId: undefined,
            todos: this.state.todos.filter(item => item.id !== todo.id)
          }))
        )
    )
  );
}
