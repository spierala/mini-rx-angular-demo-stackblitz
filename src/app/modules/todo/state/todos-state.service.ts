import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Filter } from '../models/filter';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { TodosApiService } from '../services/todos-api.service';
import { Action, createFeatureSelector, createSelector, FeatureStore } from 'mini-rx-store';

// STATE INTERFACE
interface TodoState {
    todos: Todo[];
    selectedTodoId: number;
    filter: Filter;
    newTodo: Todo; // Used when creating a new Todo
}

// INITIAL STATE
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
    newTodo: undefined,
};

// MEMOIZED SELECTORS
const getTodosFeatureSelector = createFeatureSelector<TodoState>();
const getTodos = createSelector(getTodosFeatureSelector, (state) => state.todos);
const getFilter = createSelector(getTodosFeatureSelector, (state) => state.filter);
const getTodosFiltered = createSelector(getTodos, getFilter, (todos, filter) => {
    return todos.filter((item) => {
        return (
            item.title.toUpperCase().indexOf(filter.search.toUpperCase()) > -1 &&
            (filter.category.isBusiness ? item.isBusiness : true) &&
            (filter.category.isPrivate ? item.isPrivate : true)
        );
    });
});
const getTodosDone = createSelector(getTodosFiltered, (todos) =>
    todos.filter((todo) => todo.isDone)
);
const getTodosNotDone = createSelector(getTodosFiltered, (todos) =>
    todos.filter((todo) => !todo.isDone)
);
const getNewTodo = createSelector(getTodosFeatureSelector, (state) => state.newTodo);
const getSelectedTodoId = createSelector(getTodosFeatureSelector, (state) => state.selectedTodoId);
const getSelectedTodo = createSelector(
    getTodos,
    getSelectedTodoId,
    getNewTodo,
    (todos, selectedTodoId, newTodo) => {
        if (newTodo) {
            return newTodo;
        }
        return todos.find((item) => item.id === selectedTodoId);
    }
);

@Injectable({
    providedIn: 'root',
})
export class TodosStateService extends FeatureStore<TodoState> {
    // STATE OBSERVABLES
    todosDone$: Observable<Todo[]> = this.select(getTodosDone);
    todosNotDone$: Observable<Todo[]> = this.select(getTodosNotDone);
    filter$: Observable<Filter> = this.select(getFilter);
    selectedTodo$: Observable<Todo> = this.select(getSelectedTodo);

    constructor(private apiService: TodosApiService) {
        super('todos', initialState);

        this.load();
    }

    // UPDATE STATE
    selectTodo(todo: Todo) {
        this.setState({ selectedTodoId: todo.id }, 'selectTodo');
    }

    initNewTodo() {
        this.setState({ newTodo: new Todo(), selectedTodoId: undefined }, 'initNewTodo');
    }

    clearSelectedTodo() {
        this.setState(
            {
                selectedTodoId: undefined,
                newTodo: undefined,
            },
            'clearSelectedTodo'
        );
    }

    updateFilter(filter: Filter) {
        this.setState(
            {
                filter: {
                    ...this.state.filter,
                    ...filter,
                },
            },
            'updateFilter'
        );
    }

    // API CALLS...
    // ...with effect
    load = this.effect((payload$) => {
        return payload$.pipe(
            mergeMap(() =>
                this.apiService.getTodos().pipe(
                    tap((todos) => this.setState({ todos }, 'loadSuccess')),
                    catchError(() => EMPTY)
                )
            )
        );
    });

    // ... with effect and optimistic update / undo
    create = this.effect<{ todo: Todo; apiFail: boolean }>(
        // FYI: we can skip the $payload pipe when using just one RxJS operator
        mergeMap(({ todo, apiFail }) => {
            const optimisticUpdate: Action = this.setState(
                {
                    todos: [...this.state.todos, todo],
                },
                'createOptimistic'
            );

            return this.apiService.createTodo(todo, apiFail).pipe(
                tap((newTodo) => {
                    this.setState(
                        (state) => ({
                            todos: state.todos.map((item) =>
                                item === todo
                                    ? {
                                          ...item,
                                          id: newTodo.id,
                                      }
                                    : item
                            ),
                            newTodo: undefined,
                        }),
                        'createSuccess'
                    );
                }),
                catchError(() => {
                    this.undo(optimisticUpdate);
                    return EMPTY;
                })
            );
        })
    );

    // ...with subscribe
    update(todo: Todo) {
        this.apiService.updateTodo(todo).subscribe((updatedTodo) => {
            this.setState(
                {
                    todos: this.state.todos.map((item) =>
                        item.id === todo.id ? updatedTodo : item
                    ),
                },
                'updateSuccess'
            );
        });
    }

    // ...with subscribe
    delete(todo: Todo) {
        this.apiService.deleteTodo(todo).subscribe(() => {
            this.setState(
                {
                    selectedTodoId: undefined,
                    todos: this.state.todos.filter((item) => item.id !== todo.id),
                },
                'deleteSuccess'
            );
        });
    }
}
