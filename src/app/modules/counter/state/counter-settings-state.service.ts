import { Injectable } from '@angular/core';
import { FeatureStore } from 'mini-rx-store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CounterSettingsState {
  min: number;
  max: number;
}

const initialState: CounterSettingsState = {
  min: 40,
  max: 44
};

@Injectable({
  providedIn: 'root'
})
export class CounterSettingsStateService extends FeatureStore<CounterSettingsState>{

  settings$: Observable<CounterSettingsState> = this.select().pipe(tap(console.log));

  constructor() {
    super('counterSettings', initialState)
  }


  updateSettings(settings: CounterSettingsState) {
    this.setState(settings);
  }
}
