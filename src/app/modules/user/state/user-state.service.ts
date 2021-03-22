import { Injectable } from '@angular/core';
import { FeatureStore } from 'mini-rx-store';
import { Observable } from 'rxjs';

interface UserState {
    isAdmin: boolean;
}

const initialState: UserState = {
    isAdmin: false,
};

@Injectable({
    providedIn: 'root',
})
export class UserStateService extends FeatureStore<UserState> {
    isAdmin$: Observable<boolean> = this.select((state) => state.isAdmin);

    constructor() {
        super('user', initialState);
    }

    toggleIsAdmin() {
        this.setState((state) => ({ isAdmin: !state.isAdmin }));
    }
}
