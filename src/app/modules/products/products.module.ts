import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsShellComponent } from './components/products-shell/products-shell.component';
import { EffectsModule, StoreModule } from 'mini-rx-store-ng';
import { productReducer } from './state/product.reducer';
import { ProductEffects } from './state/product.effects';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';

@NgModule({
    declarations: [ProductsShellComponent, ProductDetailComponent, ProductListComponent, ProductFilterComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    EffectsModule.register([ProductEffects]),
    StoreModule.forFeature('products', productReducer),
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductsModule {}
