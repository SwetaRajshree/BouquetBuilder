const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let c = fs.readFileSync(file, 'utf8');

// Find the Forever Flowers HeroCard and fix its onClick
// It's the 4th HeroCard - after "Forever Flowers" title, onClick is setCat("customize")
// We need to change only the onClick that comes right after the Forever Flowers title

const marker = 'title={"Forever Flowers,\\nAlways Blooming"}';
const idx = c.indexOf(marker);
if (idx === -1) { console.log('Marker not found!'); process.exit(1); }

// Find the onClick after this marker
const onClickOld = 'onClick={()=>setCat("customize")}';
const onClickNew = 'onClick={()=>setCat("flowers")}';

// Only replace the first occurrence after the marker
const before = c.substring(0, idx);
let after = c.substring(idx);
after = after.replace(onClickOld, onClickNew);

fs.writeFileSync(file, before + after, 'utf8');
console.log('Fixed onClick for Forever Flowers banner!');
