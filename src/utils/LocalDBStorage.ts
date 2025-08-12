import { Page } from "../modules/Notes/types/Page";

/**
 * LocalDBStorage - A class for storing application data in IndexedDB
 */
export class LocalDBStorage {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;
  private stores = ['projects', 'tasks', 'pages'];
  private indexes: { [key: string]: string[] } = {
    tasks: ['projectId'],
  }
  
  /**
   * Creates a new LocalDBStorage instance
   * @param dbName The name of the database
   * @param dbVersion The version of the database schema
   */
  constructor(dbName: string = 'appDatabase', dbVersion: number = 1) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  /**
   * Initialize the database connection
   * @returns Promise that resolves when the database is ready
   */
  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for each data type if they don't exist
        this.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const objectStore = db.createObjectStore(storeName, { keyPath: 'id' });
            this.indexes[storeName]?.forEach(index => {
              objectStore.createIndex(index, index, { unique: false });
            });
          }
          if (storeName === 'pages') {
            const transaction = (event.target as IDBOpenDBRequest).transaction;
            if (transaction) {
              const pagesStore = transaction.objectStore('pages');
              const getAllRequest = pagesStore.getAll();
              
              getAllRequest.onsuccess = () => {
                const pages = getAllRequest.result as Page[];
                pages.forEach((page: Page) => {
                  if (!page.version) {
                    page.version = 1;
                    pagesStore.put(page);
                  }
                });
              };
            }
          }
        });
      };
    });
  }

  /**
   * Add an item to a store
   * @param storeName The name of the store ('projects', 'tasks', 'notebooks', 'notes')
   * @param item The item to add (must have an 'id' property)
   * @returns Promise that resolves with the added item
   */
  async add<T extends { id: string }>(storeName: string, item: T): Promise<T> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onsuccess = () => resolve(item);
      request.onerror = (event) => {
        console.error(`Error adding to ${storeName}:`, (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Update an existing item in a store
   * @param storeName The name of the store
   * @param item The item to update (must have an 'id' property)
   * @returns Promise that resolves with the updated item
   */
  async update<T extends { id: string }>(storeName: string, item: T): Promise<T> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve(item);
      request.onerror = (event) => {
        console.error(`Error updating in ${storeName}:`, (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Get an item by its ID
   * @param storeName The name of the store
   * @param id The ID of the item to retrieve
   * @returns Promise that resolves with the item or null if not found
   */
  async get<T>(storeName: string, id: string): Promise<T | null> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = (event) => {
        console.error(`Error getting from ${storeName}:`, (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Get all items from a store
   * @param storeName The name of the store
   * @returns Promise that resolves with an array of all items
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error(`Error getting all from ${storeName}:`, (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async search<T>(storeName: string, column: string, value: string): Promise<T[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(column);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => {
        console.error(`Error searching in ${storeName}:`, (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Delete an item by its ID
   * @param storeName The name of the store
   * @param id The ID of the item to delete
   * @returns Promise that resolves when the item is deleted
   */
  async delete(storeName: string, id: string): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error(`Error deleting from ${storeName}:`, (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Clear all items from a store
   * @param storeName The name of the store
   * @returns Promise that resolves when the store is cleared
   */
  async clear(storeName: string): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error(`Error clearing ${storeName}:`, (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

const CURRENT_DB_VERSION = 3;
const DB_NAME = 'appDatabase';

// Create and export a singleton instance
export const localDB = new LocalDBStorage(DB_NAME, CURRENT_DB_VERSION); 