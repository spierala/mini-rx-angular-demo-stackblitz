import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from './todos.service';

export class TodosData implements InMemoryDbService {
    createDb() {
        const todos: Todo[] = [
            {
                id: 1,
                title: 'TODO 1',
                isDone: false,
            },
            {
                id: 2,
                title: 'TODO 2',
                isDone: false,
            },
            {
                id: 3,
                title: 'TODO 3',
                isDone: true,
            },
        ];
        return { todos };
    }
}
