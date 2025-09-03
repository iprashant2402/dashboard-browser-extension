export type Theme = 'ocean' | 'morning-dew' | 'golden-hour' | 'midnight-ember' | 'northern-lights' | 'comfort' | 'comfort-lite' | 'linus' | 'torvalds' | 'black-paper' | 'white-paper' | 'black-paper-lite' | 'white-paper-lite';

export const THEMES: Theme[] = ['black-paper-lite', 'white-paper-lite', 'ocean', 'morning-dew', 'golden-hour', 'midnight-ember', 'northern-lights', 'comfort', 'linus', 'black-paper', 'white-paper'];

export const DEFAULT_THEME: Theme = 'black-paper-lite';

export const THEME_DISPLAY_NAMES: Record<Theme, string> = {
    'black-paper-lite': 'Dark (Default)',
    'white-paper-lite': 'Light (Default)',
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