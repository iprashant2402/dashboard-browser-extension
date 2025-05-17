export type Theme = 'ocean' | 'morning-dew' | 'golden-hour' | 'midnight-ember' | 'northern-lights' | 'comfort' | 'linus' | 'torvalds';

export const THEMES: Theme[] = ['ocean', 'morning-dew', 'golden-hour', 'midnight-ember', 'northern-lights', 'comfort', 'linus', 'torvalds'];

export const DEFAULT_THEME: Theme = 'ocean';

export const THEME_DISPLAY_NAMES: Record<Theme, string> = {
    'ocean': 'Ocean',
    'morning-dew': 'Morning Dew',
    'golden-hour': 'Golden Hour',
    'midnight-ember': 'Midnight Ember',
    'northern-lights': 'Northern Lights',
    'comfort': 'Comfort',
    'linus': 'Linus',
    'torvalds': 'Torvalds',
}