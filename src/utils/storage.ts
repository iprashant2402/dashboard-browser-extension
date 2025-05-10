class PersistenceStorage {
    private storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    public setItem(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    public getItem<T>(key: string): T | null {
        const item = this.storage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    public removeItem(key: string) {
        this.storage.removeItem(key);
    }

    public clear() {
        this.storage.clear();
    }
}

export const storage = new PersistenceStorage();