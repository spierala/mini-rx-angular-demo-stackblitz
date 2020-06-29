import { Injectable } from '@angular/core';
import { Feature } from 'mini-rx-store';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const apiUrl = 'api/todos/';

export class Todo {
    id: number;
    title: string;
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
    todos$: Observable<Todo[]> = this.select((state) => state.todos);
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
        switchMap((todo) =>
            this.http.put<Todo>(apiUrl + todo.id, todo).pipe(
                map((updatedTodo) => ({
                    todos: this.state.todos.map((item) =>
                        item.id === todo.id ? updatedTodo : item
                    ),
                }))
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
