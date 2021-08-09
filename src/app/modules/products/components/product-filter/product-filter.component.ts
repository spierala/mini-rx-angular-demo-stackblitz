import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject();

  @Input()
  set search(search: string) {
    this.formGroup.setValue({search}, { emitEvent: false });
  }

  @Output()
  searchChanged: EventEmitter<string> = new EventEmitter<string>();

  formGroup: FormGroup = new FormGroup({
    search: new FormControl()
  });

  constructor() { }

  ngOnInit(): void {
    this.formGroup
      .get('search')
      .valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(350))
      .subscribe((value) => {
        this.searchChanged.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
