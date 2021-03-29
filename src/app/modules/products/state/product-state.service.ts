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
    updateSearch,
    addProductToCart,
    removeProductFromCart,
} from './product.actions';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';

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
                price: undefined,
            };
        } else {
            return currentProductId ? state.products.find((p) => p.id === currentProductId) : null;
        }
    }
);
const getProducts = createSelector(getProductFeatureState, (state) => state.products);
const getError = createSelector(getProductFeatureState, (state) => state.error);
const getSearch = createSelector(getProductFeatureState, (state) => state.search);
const getFilteredProducts = createSelector(getProducts, getSearch, (products, search) => {
    return products.filter(
        (item) => item.productName.toUpperCase().indexOf(search.toUpperCase()) > -1
    );
});
const getCartItems = createSelector(getProductFeatureState, (state) => state.cart);
const getCartItemsWithExtraData = createSelector(
    getProducts,
    getCartItems,
    (products, cartItems) => {
        return cartItems.reduce((accumulated, cartItem) => {
            const foundProduct = products.find((product) => product.id === cartItem.productId);
            if (foundProduct) {
                const newCartItem: CartItem = {
                    ...cartItem,
                    productName: foundProduct.productName,
                    total: foundProduct.price * cartItem.amount,
                };
                return [...accumulated, newCartItem];
            }
            return accumulated;
        }, []);
    }
);
const getCartItemsAmount = createSelector(getCartItemsWithExtraData, (cartItems) => {
    return cartItems.length;
});
const getHasCartItems = createSelector(getCartItemsAmount, (amount) => {
    return amount > 0;
});
const getCartTotalPrice = createSelector(getCartItemsWithExtraData, (cartItemsWithExtra) =>
    cartItemsWithExtra.reduce((previousValue: number, currentValue: CartItem) => {
        return previousValue + currentValue.total;
    }, 0)
);

@Injectable({
    providedIn: 'root',
})
export class ProductStateService {
    displayCode$: Observable<boolean> = this.store.select(getShowProductCode);
    selectedProduct$: Observable<Product> = this.store.select(getCurrentProduct);
    products$: Observable<Product[]> = this.store.select(getFilteredProducts);
    errorMessage$: Observable<string> = this.store.select(getError);
    search$: Observable<string> = this.store.select(getSearch);
    cartItems$: Observable<CartItem[]> = this.store.select(getCartItemsWithExtraData);
    cartItemsAmount$: Observable<number> = this.store.select(getCartItemsAmount);
    cartTotalPrice$: Observable<number> = this.store.select(getCartTotalPrice);
    hasCartItems$: Observable<boolean> = this.store.select(getHasCartItems);

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

    updateSearch(search: string) {
        this.store.dispatch(updateSearch(search));
    }

    addProductToCart(product: Product) {
        this.store.dispatch(addProductToCart(product.id));
    }

    removeProductFromCart(cartItem: CartItem) {
        this.store.dispatch(removeProductFromCart(cartItem.productId));
    }
}
