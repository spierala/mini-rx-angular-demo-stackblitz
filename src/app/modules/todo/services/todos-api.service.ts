import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'api/todos/';

@Injectable({
    providedIn: 'root',
})
export class TodosApiService {
    constructor(private http: HttpClient) {}

    getTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(apiUrl);
    }

    createTodo(todo: Todo, apiFail: boolean): Observable<Todo> {
        return this.http.post<Todo>(apiUrl, todo).pipe(
            map((value) => {
                if (apiFail) {
                    throw new Error('simulated API error');
                }
                return value;
            })
        );
    }

    updateTodo(todo: Todo): Observable<Todo> {
        return this.http.put<Todo>(apiUrl + todo.id, todo);
    }

    deleteTodo(todo: Todo): Observable<void> {
        return this.http.delete<void>(apiUrl + todo.id);
    }
}
