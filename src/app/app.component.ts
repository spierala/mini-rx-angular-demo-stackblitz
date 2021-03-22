import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterStateService } from './modules/counter/state/counter-state.service';
import { ProductState } from './modules/products/state/product.reducer';
import { ProductStateService } from './modules/products/state/product-state.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    counter$: Observable<number> = this.counterState.$count;

    constructor(
        private counterState: CounterStateService,
        private productState: ProductStateService
    ) {}
}
