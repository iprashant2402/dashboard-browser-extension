const PAGES_QUOTES = [
    "Every idea starts with a blank page.",
    "Where thoughts find structure.",
    "Your second brain, one note at a time.",
    "Capture more. Forget less.",
    "Pages that think with you.",
    "Turning scribbles into clarity.",
    "Because memory is overrated.",
    "What you write, you remember.",
    "Ink it down or let it drown.",
    "The mind forgets. The page remembers.",
    "Thoughts are fleeting — pages are not.",
    "Write it to see it clearly.",
    "A notebook is a universe waiting to be written.",
];

export const TASKS_QUOTES = [
    "Where plans meet progress.",
    "Turning to-dos into ta-das.",
    "Get things out of your head — and done.",
    "Organize. Prioritize. Execute.",
    "Ideas become outcomes here.",
    "Build something that matters.",
    "One board closer to done.",
    "Because goals need a game plan.",
    "You don’t need more time, just better boards.",
    "Momentum lives here.",
    "Your work, in motion.",
    "Where focus finds direction.",
];

export const getRandomQuote = () => {
    return PAGES_QUOTES[Math.floor(Math.random() * PAGES_QUOTES.length)];
}

export const getRandomTaskQuote = () => {
    return TASKS_QUOTES[Math.floor(Math.random() * TASKS_QUOTES.length)];
}