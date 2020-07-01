import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodosService } from '../todos.service';
import { Todo } from '../model/todo';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css'],
})
export class TodoDetailComponent implements OnInit {
  @Input()
  todo: Todo;

  constructor(private todosService: TodosService) {}

  ngOnInit() {}

  submit(form: NgForm) {
    const newTodo: Todo = {
      ...this.todo,
      ...form.value,
    };

    if (newTodo.id) {
      this.todosService.update(newTodo);
    } else {
      this.todosService.create(newTodo);
    }
  }

  delete() {
    this.todosService.delete(this.todo);
  }

  onClose() {
    this.todosService.clearSelectedTodo();
  }
}
