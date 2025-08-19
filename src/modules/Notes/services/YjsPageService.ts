import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { Page } from '../types/Page';

export class YjsPageService {
    private docs: Map<string, Y.Doc> = new Map();
    private providers: Map<string, IndexeddbPersistence> = new Map();

    private createDoc(pageId: string): Y.Doc {
        if (this.docs.has(pageId)) {
            return this.docs.get(pageId)!;
        }

        const doc = new Y.Doc();
        this.docs.set(pageId, doc);

        const provider = new IndexeddbPersistence(`page-${pageId}`, doc);
        this.providers.set(pageId, provider);

        return doc;
    }

    getPageDoc(pageId: string): Y.Doc {
        return this.createDoc(pageId);
    }

    async initializePage(page: Page): Promise<Y.Doc> {
        const doc = this.createDoc(page.id);
        
        const yTitle = doc.getText('title');
        const yContent = doc.getText('content');
        const yMetadata = doc.getMap('metadata');

        if (yTitle.length === 0) {
            yTitle.insert(0, page.title);
        }
        
        if (yContent.length === 0 && page.content) {
            yContent.insert(0, page.content);
        }

        yMetadata.set('createdAt', page.createdAt.toISOString());
        yMetadata.set('updatedAt', page.updatedAt.toISOString());
        yMetadata.set('order', page.order);

        await this.providers.get(page.id)?.whenSynced;
        
        return doc;
    }

    pageFromDoc(doc: Y.Doc, pageId: string): Page {
        const yTitle = doc.getText('title');
        const yContent = doc.getText('content');
        const yMetadata = doc.getMap('metadata');

        return {
            id: pageId,
            title: yTitle.toString(),
            content: yContent.toString(),
            createdAt: new Date(yMetadata.get('createdAt') as string),
            updatedAt: new Date(yMetadata.get('updatedAt') as string),
            order: yMetadata.get('order') as number
        };
    }

    updatePageTitle(pageId: string, title: string): void {
        const doc = this.getPageDoc(pageId);
        const yTitle = doc.getText('title');
        
        doc.transact(() => {
            yTitle.delete(0, yTitle.length);
            yTitle.insert(0, title);
            
            const yMetadata = doc.getMap('metadata');
            yMetadata.set('updatedAt', new Date().toISOString());
        });
    }

    updatePageContent(pageId: string, content: string): void {
        const doc = this.getPageDoc(pageId);
        const yContent = doc.getText('content');
        
        doc.transact(() => {
            yContent.delete(0, yContent.length);
            yContent.insert(0, content);
            
            const yMetadata = doc.getMap('metadata');
            yMetadata.set('updatedAt', new Date().toISOString());
        });
    }

    getDocumentState(pageId: string): Uint8Array {
        const doc = this.getPageDoc(pageId);
        return Y.encodeStateAsUpdate(doc);
    }

    applyDocumentUpdate(pageId: string, update: Uint8Array): void {
        const doc = this.getPageDoc(pageId);
        Y.applyUpdate(doc, update);
    }

    async destroy(pageId: string): Promise<void> {
        const provider = this.providers.get(pageId);
        if (provider) {
            provider.destroy();
            this.providers.delete(pageId);
        }
        
        const doc = this.docs.get(pageId);
        if (doc) {
            doc.destroy();
            this.docs.delete(pageId);
        }
    }

    async destroyAll(): Promise<void> {
        const promises = Array.from(this.docs.keys()).map(pageId => this.destroy(pageId));
        await Promise.all(promises);
    }
}

export const yjsPageService = new YjsPageService();