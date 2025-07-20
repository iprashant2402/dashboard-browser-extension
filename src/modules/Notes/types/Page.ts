export interface Page {
    id: string;
    title: string;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
    order: number;
}