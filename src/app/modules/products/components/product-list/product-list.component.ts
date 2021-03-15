import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
    @Input()
    products: Product[];

    @Input()
    selectedProduct: Product;

    @Output()
    productSelect: EventEmitter<Product> = new EventEmitter<Product>();

    constructor() {}

    ngOnInit(): void {}
}
