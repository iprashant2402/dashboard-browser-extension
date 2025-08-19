import { IPageRepository } from "./IPageRepository";
import { Page } from "../types/Page";
import { yjsPageService } from "../services/YjsPageService";
import { localPageRepository } from "./PageRepository";

export class YjsPageRepository implements IPageRepository {
    
    async getPages(): Promise<Page[]> {
        return await localPageRepository.getPages();
    }

    async getPage(id: string): Promise<Page> {
        try {
            const doc = yjsPageService.getPageDoc(id);
            const page = yjsPageService.pageFromDoc(doc, id);
            
            if (page.title || page.content) {
                return page;
            }
            
            return await localPageRepository.getPage(id);
        } catch (error) {
            return await localPageRepository.getPage(id);
        }
    }

    async createPage(page: Page): Promise<Page> {
        const createdPage = await localPageRepository.createPage(page);
        
        await yjsPageService.initializePage(createdPage);
        
        return createdPage;
    }

    async updatePage(id: string, pageUpdate: Partial<Page>): Promise<Page> {
        const currentPage = await this.getPage(id);
        const updatedPage = { ...currentPage, ...pageUpdate, updatedAt: new Date() };
        
        if (pageUpdate.title !== undefined) {
            yjsPageService.updatePageTitle(id, pageUpdate.title);
        }
        
        if (pageUpdate.content !== undefined) {
            yjsPageService.updatePageContent(id, pageUpdate.content);
        }
        
        await localPageRepository.updatePage(id, updatedPage);
        
        return updatedPage;
    }

    async deletePage(id: string): Promise<void> {
        await yjsPageService.destroy(id);
        await localPageRepository.deletePage(id);
    }

    async getLastModifiedPage(): Promise<Page | null> {
        return await localPageRepository.getLastModifiedPage();
    }

    async getLastAccessedPage(): Promise<Page | null> {
        return await localPageRepository.getLastAccessedPage();
    }

    async syncPageToYjs(page: Page): Promise<void> {
        await yjsPageService.initializePage(page);
    }

    getYjsDocument(pageId: string) {
        return yjsPageService.getPageDoc(pageId);
    }
}

export const yjsPageRepository = new YjsPageRepository();