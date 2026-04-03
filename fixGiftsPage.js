const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let c = fs.readFileSync(file, 'utf8');

// Fix the broken sub string
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Preserved roses') && lines[i].includes('no water needed')) {
    lines[i] = '            sub="Preserved roses & dried florals that last for years — no water needed, always beautiful"';
    console.log('Fixed line', i + 1, ':', lines[i]);
    break;
  }
}
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done!');
