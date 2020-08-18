import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

export class StateService<T> {
  private state$: BehaviorSubject<T>;
  protected get state(): T {
    return this.state$.getValue();
  }

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged(),
      shareReplay(1) // TODO: Is this a good idea?
    );
  }

  protected setState(state: Partial<T>) {
    this.state$.next({
      ...this.state$.getValue(),
      ...state,
    });
  }
}
