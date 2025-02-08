import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backgroundsDir = path.join(__dirname, '../public/images/backgrounds');
const outputFile = path.join(__dirname, '../src/app/data/backgrounds.json');

// Create directories if they don't exist
if (!fs.existsSync(backgroundsDir)) {
    fs.mkdirSync(backgroundsDir, { recursive: true });
}

if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

// Read all files from the backgrounds directory
const getBackgroundImages = () => {
    const files = fs.readdirSync(backgroundsDir);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
};

// Generate the JSON file
const backgrounds = getBackgroundImages();
const jsonContent = JSON.stringify({ backgrounds }, null, 2);

fs.writeFileSync(outputFile, jsonContent);

console.log(`Generated backgrounds.json with ${backgrounds.length} images`); 