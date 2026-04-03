const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Fix 1: Add flowers to CATEGORIES array
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('key:"all"') && lines[i].includes('All Gifts')) {
    // Insert flowers category after this line
    lines.splice(i + 1, 0, '  { key:"flowers",   label:"Forever Flowers",   icon:"🌸" },');
    console.log('Added flowers category at line', i + 2);
    break;
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done!');
