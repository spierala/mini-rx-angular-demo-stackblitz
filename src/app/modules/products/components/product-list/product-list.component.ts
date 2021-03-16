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

    @Input()
    displayCode: boolean;

    @Output()
    productSelect: EventEmitter<Product> = new EventEmitter<Product>();

    @Output()
    displayCodeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit(): void {}
}
