import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DbService } from './api/db.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TodoModule } from './modules/todo/todo.module';
import { CounterModule } from './modules/counter/counter.module';
import { StoreDevtoolsModule, StoreModule } from 'mini-rx-store-ng';
import { ImmutableStateExtension, UndoExtension } from 'mini-rx-store';
import { ProductStateModule } from './modules/products/state/product-state.module';
import { UserModule } from './modules/user/user.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(DbService, { delay: 500, put204: false }),
        AppRoutingModule,
        TodoModule,
        CounterModule,
        UserModule,
        StoreModule.forRoot({
            extensions: [new ImmutableStateExtension(), new UndoExtension()],
        }),
        StoreDevtoolsModule.instrument({
            name: 'Stackblitz Angular MiniRx Todos Showcase',
            maxAge: 25,
            latency: 250,
        }),
        ProductStateModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
