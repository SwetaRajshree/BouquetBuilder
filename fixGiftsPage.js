const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

let inInstant = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Need It Fast?') || lines[i].includes('Instant Gifts')) inInstant = true;
  if (inInstant && lines[i].includes('onClick={()=>setCat("instant")}')) {
    lines[i] = lines[i].replace('onClick={()=>setCat("instant")}', 'onClick={()=>navigate(\'/instant-gifts\')}');
    console.log('Fixed line', i + 1, ':', lines[i].trim());
    break;
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done!');
