import { Injectable } from '@angular/core';
import { FeatureStore } from 'mini-rx-store';
import { Observable } from 'rxjs';

interface UserState {
    firstName: string;
    lastName: string;
    permissions: Permissions;
}

interface Permissions {
    canUpdateProducts: boolean;
}

const initialState: UserState = {
    firstName: 'John',
    lastName: 'Doe',
    permissions: {
        canUpdateProducts: false,
    },
};

@Injectable({
    providedIn: 'root',
})
export class UserStateService extends FeatureStore<UserState> {
    permissions$: Observable<Permissions> = this.select((state) => state.permissions);
    userFullName$: Observable<string> = this.select(
        (state) => state.firstName + ' ' + state.lastName
    );

    constructor() {
        super('user', initialState);
    }

    toggleCanUpdateProducts() {
        this.setState((state) => ({
            permissions: {
                ...state.permissions,
                canUpdateProducts: !state.permissions.canUpdateProducts,
            },
        }));
    }
}
