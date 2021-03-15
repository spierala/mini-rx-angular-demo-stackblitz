import { Injectable } from '@angular/core';

import * as fromProducts from './product.reducer';
import { createFeatureSelector, createSelector, Store } from 'mini-rx-store';
import {
    clearCurrentProduct,
    createProduct,
    deleteProduct,
    initializeCurrentProduct,
    load,
    setCurrentProduct,
    toggleProductCode,
    updateProduct,
} from './product.actions';
import { Product } from '../models/product';

// Selector functions
const getProductFeatureState = createFeatureSelector<fromProducts.ProductState>('products');

const getShowProductCode = createSelector(getProductFeatureState, (state) => state.showProductCode);

const getCurrentProductId = createSelector(
    getProductFeatureState,
    (state) => state.currentProductId
);

const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state, currentProductId) => {
        if (currentProductId === 0) {
            return {
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0,
            };
        } else {
            return currentProductId ? state.products.find((p) => p.id === currentProductId) : null;
        }
    }
);

const getProducts = createSelector(getProductFeatureState, (state) => state.products);

const getError = createSelector(getProductFeatureState, (state) => state.error);

@Injectable({
    providedIn: 'root',
})
export class ProductStateService {
    displayCode$ = this.store.select(getShowProductCode);
    selectedProduct$ = this.store.select(getCurrentProduct);
    products$ = this.store.select(getProducts);
    errorMessage$ = this.store.select(getError);

    constructor(private store: Store) {
        this.load();
    }

    private load() {
        this.store.dispatch(load());
    }

    toggleProductCode(value: boolean) {
        this.store.dispatch(toggleProductCode(value));
    }

    newProduct(): void {
        this.store.dispatch(initializeCurrentProduct());
    }

    productSelected(product: Product): void {
        this.store.dispatch(setCurrentProduct(product));
    }

    clearProduct(): void {
        this.store.dispatch(clearCurrentProduct());
    }

    create(product: Product): void {
        this.store.dispatch(createProduct(product));
    }

    update(product: Product): void {
        this.store.dispatch(updateProduct(product));
    }

    delete(product: Product): void {
        this.store.dispatch(deleteProduct(product.id));
    }
}
