import { Injectable } from "@angular/core";
import { Feature } from "mini-rx-store";
import { Observable } from "rxjs";
import { switchMap, concatMap, map } from "rxjs/operators";
import { HttpClientModule, HttpClient } from "@angular/common/http";

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
  title: "Hello MiniRx",
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
    return (state.todos).find(
      item => item.id === state.selectedTodoId
    );
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

  removeAllTodos() {
    this.setState({ todos: [] });
  }

  load = this.createEffect(
      switchMap(() =>
        this.http
          .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
          .pipe(map(todos => ({ todos })))
      )
  );

  create = this.createEffect<Todo>(
      switchMap(todo =>
        this.http
          .post<Todo>("https://jsonplaceholder.typicode.com/todos", todo)
          .pipe(map(todo => ({ todos: [...this.state.todos, todo] })))
      )
  );

  update = this.createEffect<Todo>(
      switchMap(todo =>
        this.http
          .put<Todo>(
            "https://jsonplaceholder.typicode.com/todos/" + todo.id,
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
          .delete<Todo>(
            "https://jsonplaceholder.typicode.com/todos/" + todo.id
          )
          .pipe(
            map(() => ({
              selectedTodoId: undefined,
              todos: this.state.todos.filter(item => item.id !== todo.id)
            }))
          )
      )
  );
}
