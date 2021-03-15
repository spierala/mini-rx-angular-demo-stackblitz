import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { NgForm } from '@angular/forms';
import { ProductStateService } from '../../state/product-state.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
    @Input()
    product: Product;

    constructor(private stateService: ProductStateService) {}

    ngOnInit(): void {}

    onClose() {
        this.stateService.clearProduct();
    }

    submit(form: NgForm) {
        const newTodo: Product = {
            ...this.product,
            ...form.value,
        };

        if (newTodo.id) {
            this.stateService.update(newTodo);
        } else {
            this.stateService.create(newTodo);
        }
    }

    delete(product: Product) {
        this.stateService.delete(product);
    }
}
