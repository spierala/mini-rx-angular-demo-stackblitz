import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CounterSettingsStateService } from '../state/counter-settings-state.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-counter-settings',
  templateUrl: './counter-settings.component.html',
  styleUrls: ['./counter-settings.component.css']
})
export class CounterSettingsComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  @ViewChild(NgForm, { static: true }) ngForm: NgForm;

  formGroup: FormGroup = new FormGroup({
    min: new FormControl(),
    max: new FormControl(),
  });

  constructor(
     public counterSettingsState: CounterSettingsStateService
  ) { }

  ngOnInit() {
    // Issue: emits always when the component/form initializes


    // this.counterSettingsState.settings$.pipe(
    //   takeUntil(this.unsubscribe$)
    // ).subscribe(settings => this.formGroup.setValue(settings, {emitEvent: false}))


    this.formGroup.valueChanges.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(value => {
      console.log('valueChange', value)
      this.counterSettingsState.updateSettings(value);
    })
  };

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
