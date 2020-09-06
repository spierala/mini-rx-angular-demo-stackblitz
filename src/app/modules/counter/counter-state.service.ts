import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feature } from 'mini-rx-store';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 42
}

@Injectable({
  providedIn: 'root'
})
export class CounterStateService extends Feature<CounterState>{

  $count: Observable<number> = this.select(state => state.count);

  constructor() {
    super('counter', initialState)
  }

  increment() {
    this.setState({count: this.state.count + 1}, 'increment')
  }

  decrement() {
    this.setState({count: this.state.count - 1}, 'decrement')
  }
}
