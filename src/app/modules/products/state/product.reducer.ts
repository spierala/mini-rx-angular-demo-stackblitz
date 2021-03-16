import {
    clearCurrentProduct,
    createProductFail,
    createProductSuccess,
    deleteProductFail,
    deleteProductSuccess,
    initializeCurrentProduct,
    loadFail,
    loadSuccess,
    setCurrentProduct,
    toggleProductCode,
    updateProductFail,
    updateProductOptimistic,
    updateProductSuccess, updateSearch
} from './product.actions';
import { on, reducer } from 'ts-action';
import { Product } from '../models/product';

// State for this feature (Product)
export interface ProductState {
    showProductCode: boolean;
    currentProductId: number | null;
    products: Product[];
    error: string;
    search: string;
}

const initialState: ProductState = {
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: '',
    search: ''
};

export const productReducer = reducer<ProductState>(
    initialState,
    on(toggleProductCode, (state, { payload }) => ({ ...state, showProductCode: payload })),
    on(setCurrentProduct, (state, { payload }) => ({ ...state, currentProductId: payload.id })),
    on(clearCurrentProduct, (state) => ({ ...state, currentProductId: null })),
    on(initializeCurrentProduct, (state) => ({ ...state, currentProductId: 0 })),
    on(loadSuccess, (state, { payload }) => ({
        ...state,
        products: payload,
        error: '',
    })),
    on(loadFail, (state, { payload }) => ({
        ...state,
        products: [],
        error: payload,
    })),
    on(updateProductSuccess, (state, { payload }) => {
        const updatedProducts = state.products.map((item) =>
            payload.id === item.id ? payload : item
        );
        return {
            ...state,
            products: updatedProducts,
            currentProductId: payload.id,
            error: '',
        };
    }),
    on(updateProductOptimistic, (state, { payload }) => {
        const updatedProducts = state.products.map((item) =>
            payload.id === item.id ? payload : item
        );
        return {
            ...state,
            products: updatedProducts,
        };
    }),
    on(updateProductFail, (state, { payload }) => ({
        ...state,
        error: payload,
    })),
    on(createProductSuccess, (state, { payload }) => ({
        ...state,
        products: [...state.products, payload],
        currentProductId: payload.id,
        error: '',
    })),
    on(createProductFail, (state, { payload }) => ({
        ...state,
        error: payload,
    })),
    on(deleteProductSuccess, (state, { payload }) => ({
        ...state,
        products: state.products.filter((product) => product.id !== payload),
        currentProductId: null,
        error: '',
    })),
    on(deleteProductFail, (state, { payload }) => ({
        ...state,
        error: payload,
    })),
    on(updateSearch, (state, { payload }) => ({
        ...state,
        search: payload,
    }))
);
