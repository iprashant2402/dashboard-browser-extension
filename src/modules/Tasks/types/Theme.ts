export type Theme = 'ocean' | 'morning-dew' | 'golden-hour' | 'midnight-ember' | 'northern-lights' | 'comfort' | 'comfort-lite' | 'linus' | 'torvalds' | 'black-paper' | 'white-paper' | 'black-paper-lite';

export const THEMES: Theme[] = ['ocean', 'morning-dew', 'golden-hour', 'midnight-ember', 'northern-lights', 'comfort', 'linus', 'black-paper', 'white-paper', 'black-paper-lite'];

export const DEFAULT_THEME: Theme = 'black-paper-lite';

export const THEME_DISPLAY_NAMES: Record<Theme, string> = {
    'black-paper-lite': 'Dark (Default)',
    'ocean': 'Ocean',
    'morning-dew': 'Morning Dew',
    'golden-hour': 'Golden Hour',
    'midnight-ember': 'Midnight Ember',
    'northern-lights': 'Northern Lights',
    'comfort': 'Comfort',
    'comfort-lite': 'Comfort Lite',
    'linus': 'Linus',
    'torvalds': 'Torvalds',
    'black-paper': 'Black Paper',
    'white-paper': 'White Paper',
}