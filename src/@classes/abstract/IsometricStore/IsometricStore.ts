import { Store } from '@store';

export abstract class IsometricStore {

    protected dataStore: Store;

    public get data(): Store {
        return this.dataStore;
    }

    public set data(store: Store) {
        this.dataStore = store;
    }
}