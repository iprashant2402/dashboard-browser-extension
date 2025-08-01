import { IPageRepository } from "./IPageRepository";
import { Page } from "../types/Page";
import { localDB } from "../../../utils/LocalDBStorage";

class LocalPageRepository implements IPageRepository {
    async getPage(id: string): Promise<Page> {
        const page = await localDB.get<Page>('pages', id);
        if (!page) throw new Error('PAGE_NOT_FOUND');
        return page;
    }

    async getPages(): Promise<Page[]> {
        return await localDB.getAll<Page>('pages');
    }

    async getLastModifiedPage(): Promise<Page | null> {
        const pages = await localDB.getAll<Page>('pages');
        if (pages.length < 1) return null;
        return pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
    }

    async getLastAccessedPage(): Promise<Page | null> {
        const pages = await localDB.getAll<Page>('pages');
        if (pages.length < 1) return null;
        return pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
    }

    async createPage(page: Page): Promise<Page> {
        return await localDB.add('pages', page);
    }

    async updatePage(id: string, page: Partial<Page>): Promise<Page> {
        const pageToUpdate = await localDB.get<Page>('pages', id);
        if (!pageToUpdate) throw new Error('PAGE_NOT_FOUND');
        const updateTime = new Date();
        const updatedPage = {...pageToUpdate, ...page, updatedAt: updateTime};
        return await localDB.update<Page>('pages', updatedPage);
    }

    async deletePage(id: string): Promise<void> {
        return await localDB.delete('pages', id);
    }
}

export const localPageRepository = new LocalPageRepository();
