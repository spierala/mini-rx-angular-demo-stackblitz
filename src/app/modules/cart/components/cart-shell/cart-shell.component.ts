import { Component, OnInit } from '@angular/core';
import { ProductStateService } from '../../../products/state/product-state.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart-shell.component.html',
    styleUrls: ['./cart-shell.component.css'],
})
export class CartShellComponent implements OnInit {
    constructor(private stateService: ProductStateService) {}

    ngOnInit(): void {}
}
