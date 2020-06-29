import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from './todos.service';

export class TodosData implements InMemoryDbService {
    createDb() {
        const todos: Todo[] = [
            {
                id: 1,
                title: 'TODO 1',
            },
        ];
        return { todos };
    }
}
