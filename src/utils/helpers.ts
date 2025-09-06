import { User, USER_PROFILE_STORAGE_KEY } from "../modules/Auth";

export const expandToFullscreen = (query: string) => {
    const el = document.querySelector(query);
    if (el) {
        el.requestFullscreen();
    }
}

// Format the date
export const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString(undefined, options);
};

export const URL_REGEX =
   /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

export const EMAIL_REGEX =
   /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

export function validateUrl(url: string): boolean {
    return url === 'https://' || URL_REGEX.test(url);
 }

 export function isImgUrl(url: string): Promise<boolean> {
    if (!URL_REGEX.test(url)) return Promise.resolve(false);
    return fetch(url, {method: 'HEAD'}).then(res => {
      return res.headers.get('Content-Type')?.startsWith('image') ?? false;
    })
  }

export type Platform = 'EXTENSION' | 'WEB' | 'IOS' | 'ANDROID';

export function getCurrentPlatform(): Platform {
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.id) return 'EXTENSION';
    return 'WEB';
}

export function setUserProfileLocalStorage(user: User) {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(user));
}

export function getUserProfileLocalStorage(): User | null {
    const user = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
}