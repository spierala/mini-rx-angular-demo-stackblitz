import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  searchFc: FormControl = new FormControl();

  formGroup: FormGroup = new FormGroup({
    search: this.searchFc,
  });

  @Output()
  filterUpdate: Observable<string> = this.searchFc.valueChanges.pipe(debounceTime(350));

  constructor() {}

  ngOnInit(): void {}
}
