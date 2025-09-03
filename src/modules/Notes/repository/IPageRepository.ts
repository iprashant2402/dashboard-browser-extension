import { Page } from "../types/Page";

export interface IPageRepository {
    getPages(): Promise<Page[]>;
    getPage(id: string): Promise<Page | null>;
    createPage(page: Page): Promise<Page>;
    updatePage(id: string, page: Partial<Page>): Promise<Page>;
    deletePage(id: string): Promise<void>;
}