import { Component, OnInit } from '@angular/core';
import { ProductStateService } from '../../state/product-state.service';

@Component({
    selector: 'app-products',
    templateUrl: './products-shell.component.html',
    styleUrls: ['./products-shell.component.css'],
})
export class ProductsShellComponent implements OnInit {
    constructor(private stateService: ProductStateService) {}

    ngOnInit(): void {}
}
