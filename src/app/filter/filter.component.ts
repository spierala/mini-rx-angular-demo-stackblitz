import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Filter } from '../model/filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Input()
  set filter(filter: Filter) {
    this.formGroup.setValue(filter, { emitEvent: false });
  }

  @Output()
  filterUpdate: EventEmitter<Filter> = new EventEmitter();

  formGroup: FormGroup = new FormGroup({
    search: new FormControl(),
    isBusiness: new FormControl(),
    isPrivate: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      this.filterUpdate.emit(value);
    });
  }
}
