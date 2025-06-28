/**
 * Script to organize model images into the expected structure
 * Maps existing model folders to the ID_Name format
 */

const fs = require('fs');
const path = require('path');

// Load model data
const modelsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/models.json'), 'utf8')
);

console.log('Starting model image organization...\n');
console.log(`Found ${modelsData.length} models in database\n`);

// Print current folder structure
const modelsDir = path.join(__dirname, '../public/models');
console.log('Current folders in /public/models:');

try {
  const folders = fs.readdirSync(modelsDir)
    .filter(item => fs.statSync(path.join(modelsDir, item)).isDirectory());
  
  folders.forEach(folder => {
    console.log(`  - ${folder}`);
  });
  
  console.log(`\nTotal folders: ${folders.length}`);
} catch (error) {
  console.log('Error reading models directory:', error.message);
}

console.log('\nModel image organization script ready.');
console.log('To organize images, update the folder mappings in this script.') 