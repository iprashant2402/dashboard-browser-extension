export const expandToFullscreen = (query: string) => {
    const el = document.querySelector(query);
    if (el) {
        el.requestFullscreen();
    }
}