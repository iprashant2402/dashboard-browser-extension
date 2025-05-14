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