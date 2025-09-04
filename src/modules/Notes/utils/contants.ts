import { PageSummary } from "../types/Page";

// Query keys
export const PAGES_QUERY_KEYS = {
    allPages: ['pages', 'all-pages'] as const,
  };
export const ACCESS_TOKEN_KEY = 'access_token';
export const UPDATE_AVAILABLE_PAGES_KEY = 'update-available-pages';
export const UPDATE_AVAILABLE_PAGES_KEYS_SEPARATOR = '|';

export const RESOURCES: PageSummary[] = [
    {
        id: 'about',
        title: 'About',
        version: 1,
        updatedAt: new Date().toISOString(),
        isDeleted: false,
    },
    {
        id: 'releaseNotes',
        title: 'What\'s new?',
        version: 1,
        updatedAt: new Date().toISOString(),
        isDeleted: false,
    }
]; 