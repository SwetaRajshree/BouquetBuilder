const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Find the onClick after Forever Flowers title and change it
let inForeverFlowers = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Forever Flowers,')) inForeverFlowers = true;
  if (inForeverFlowers && lines[i].includes('onClick={()=>setCat(')) {
    lines[i] = lines[i].replace(/onClick=\{.*?\}/, 'onClick={()=>navigate(\'/forever-flowers\')}');
    console.log('Fixed line', i + 1, ':', lines[i].trim());
    break;
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done!');
