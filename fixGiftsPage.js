const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

let inHampers = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Gift Hampers') || lines[i].includes('Curated with Love') || lines[i].includes('Shop Hampers')) inHampers = true;
  if (inHampers && lines[i].includes('onClick={()=>setCat(')) {
    lines[i] = lines[i].replace(/onClick=\{.*?\}/, "onClick={()=>navigate('/gift-hampers')}");
    console.log('Fixed line', i + 1, ':', lines[i].trim());
    break;
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done!');
