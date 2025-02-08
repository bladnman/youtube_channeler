import backgroundData from '../data/backgrounds.json';

export const getRandomBackground = (): string => {
    const { backgrounds } = backgroundData;
    if (!backgrounds || backgrounds.length === 0) {
        return ''; // Return empty string if no backgrounds are available
    }
    
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    return `/images/backgrounds/${backgrounds[randomIndex]}`;
}; 