const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/pages/GiftsPage.jsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Add flowers category
c = c.replace(
  `const CATEGORIES = [\n  { key:"all",       label:"All Gifts",         icon:"✦" },\n  { key:"customize", label:"Customize Gift",    icon:"🎨" },`,
  `const CATEGORIES = [\n  { key:"all",       label:"All Gifts",         icon:"✦" },\n  { key:"flowers",   label:"Forever Flowers",   icon:"🌸" },\n  { key:"customize", label:"Customize Gift",    icon:"🎨" },`
);

// 2. Add foreverFlowers state after jewellerySubCat state
c = c.replace(
  `  const [jewellerySubCat, setJewellerySubCat] = useState("all");`,
  `  const [jewellerySubCat, setJewellerySubCat] = useState("all");\n  const [foreverFlowers, setForeverFlowers] = useState([]);`
);

// 3. Add fetch for forever flowers after jewellery fetch
c = c.replace(
  `  }, [jewellerySubCat]);`,
  `  }, [jewellerySubCat]);\n\n  useEffect(() => {\n    fetch(\`\${API}/api/gifts?category=Flowers\`)\n      .then(r => r.json())\n      .then(data => setForeverFlowers(Array.isArray(data) ? data : []))\n      .catch(() => {});\n  }, []);`
);

// 4. Map flowers and update allProducts
c = c.replace(
  `  const allProducts = cat === 'jewellery' ? jewelleryAsProducts : [...PRODUCTS, ...jewelleryAsProducts];`,
  `  const flowersAsProducts = foreverFlowers.map(f => ({\n    id: f._id, cat: 'flowers',\n    name: f.name, sub: f.description || '',\n    price: f.price, was: null,\n    badge: f.rating >= 4.9 ? 'Top Rated' : null,\n    badgeColor: f.rating >= 4.9 ? 'rose' : null,\n    tag: f.rating >= 4.9 ? 'Bestseller' : null,\n    img: f.image, rating: f.rating, reviews: Math.floor(f.rating * 30),\n  }));\n\n  const allProducts = cat === 'jewellery' ? jewelleryAsProducts\n    : cat === 'flowers' ? flowersAsProducts\n    : [...PRODUCTS, ...jewelleryAsProducts, ...flowersAsProducts];`
);

// 5. Wire Forever Flowers banner onClick to flowers category
c = c.replace(
  `            onClick={()=>setCat("customize")}\n            floatingEmojis={[\n              {emoji:"🌸", top:"10%", left:"8%",  size:18, dur:3.4, delay:0},`,
  `            onClick={()=>setCat("flowers")}\n            floatingEmojis={[\n              {emoji:"🌸", top:"10%", left:"8%",  size:18, dur:3.4, delay:0},`
);

fs.writeFileSync(file, c, 'utf8');
console.log('All changes applied!');
