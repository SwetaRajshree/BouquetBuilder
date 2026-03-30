// ─── Shops ───────────────────────────────────────────────────────────────────
export const SHOPS = [
  { id: 1, name: 'Petal & Bloom',      rating: 4.9, distance: '0.4 km', open: true,  specialty: 'Romantic Arrangements', img: '🌹', color: '#FFB6C1', reviews: 312 },
  { id: 2, name: 'Flora Fantasia',     rating: 4.7, distance: '1.2 km', open: true,  specialty: 'Exotic Flowers',        img: '🌺', color: '#E6CFFF', reviews: 198 },
  { id: 3, name: 'The Bloom Atelier',  rating: 4.8, distance: '2.1 km', open: false, specialty: 'Luxury Bouquets',       img: '🌸', color: '#B5CDA3', reviews: 445 },
  { id: 4, name: 'Garden Gate',        rating: 4.5, distance: '2.8 km', open: true,  specialty: 'Garden Style',          img: '🌼', color: '#FFF8F0', reviews: 156 },
  { id: 5, name: 'Rose & Co.',         rating: 4.6, distance: '3.5 km', open: false, specialty: 'Classic Roses',         img: '🥀', color: '#C9848A', reviews: 289 },
];

// ─── Ready Bouquets ──────────────────────────────────────────────────────────
export const BOUQUETS = [
  { id: 1, name: 'Whisper of Spring', price: 1299, img: '💐', desc: "Pastel tulips & baby's breath" },
  { id: 2, name: 'Velvet Dusk',       price: 1899, img: '🌹', desc: 'Deep red roses with eucalyptus' },
  { id: 3, name: 'Lavender Dreams',   price: 1599, img: '💜', desc: 'Lavender & white peonies' },
  { id: 4, name: 'Sunrise Bliss',     price: 1399, img: '🌻', desc: 'Sunflowers & golden freesia' },
  { id: 5, name: 'Garden Party',      price: 2199, img: '🌷', desc: 'Mixed seasonal blooms' },
  { id: 6, name: 'Cherry Blossom',    price: 1749, img: '🌸', desc: 'Blush tones & cherry sprigs' },
];

// ─── Flash Sale Bouquets ─────────────────────────────────────────────────────
export const SALE_BOUQUETS = [
  { id: 1, name: 'Romantic Reds',  orig: 2499, sale: 1249, left: 3,  disc: 50, img: '🌹', occasion: 'Romance' },
  { id: 2, name: 'Peony Cloud',    orig: 1999, sale: 1199, left: 7,  disc: 40, img: '💐', occasion: 'Birthday' },
  { id: 3, name: 'Garden Mix',     orig: 1599, sale: 959,  left: 12, disc: 40, img: '🌼', occasion: 'General' },
  { id: 4, name: 'Blush Delight',  orig: 1799, sale: 1079, left: 5,  disc: 40, img: '🌸', occasion: 'Anniversary' },
  { id: 5, name: 'Sunflower Set',  orig: 1299, sale: 779,  left: 9,  disc: 40, img: '🌻', occasion: 'Birthday' },
  { id: 6, name: 'Lavender Kiss',  orig: 2099, sale: 1049, left: 2,  disc: 50, img: '💜', occasion: 'Romance' },
];

// ─── Subscription Packages ───────────────────────────────────────────────────
export const PACKAGES = [
  {
    id: 1, title: 'Weekly Bloom',    price: '₹1,499/wk', freq: 'Every week',
    perks: ['Fresh arrangement weekly', 'Free delivery', 'Seasonal picks'],
    icon: '🌷',
  },
  {
    id: 2, title: 'Monthly Romance', price: '₹3,999/mo',  freq: 'Every month', popular: true,
    perks: ['4 bouquets/month', 'Priority scheduling', 'Handwritten notes', '10% off add-ons'],
    icon: '💐',
  },
  {
    id: 3, title: 'Yearly Garden',   price: '₹39,999/yr', freq: 'Every week',
    perks: ['52 bouquets/year', 'Dedicated florist', 'Custom themes', 'Free gifts', 'VIP support'],
    icon: '🌹',
  },
];

// ─── Customizer Options ──────────────────────────────────────────────────────
export const FLOWERS  = ['🌹 Rose', '🌷 Tulip', '🌸 Cherry Blossom', '🌺 Hibiscus', '🌻 Sunflower', '💐 Peony', '🪷 Lotus', '🌼 Daisy'];
export const COLORS   = ['#FFB6C1', '#E6CFFF', '#FFF3CD', '#B5CDA3', '#C9848A', '#F8BBD9', '#FFDDC1', '#D4E9FF'];
export const WRAPS    = ['🎀 Satin Ribbon', '📜 Kraft Paper', '🌿 Leaf Bundle', '✨ Glitter Wrap'];
export const RIBBONS  = ['💗 Pink Bow', '🎀 Silk Bow', '✨ Glitter Trim', '🌿 Twine Wrap'];
export const CARD_COLORS = { cream: '#FFF8F0', pink: '#FFE4EA', lavender: '#F3EAFF', white: '#FFFFFF' };

// ─── Special Occasions ───────────────────────────────────────────────────────
export const OCCASIONS = [
  { id: 1, name: "Valentine's Day",  icon: '❤️', date: '2026-02-14' },
  { id: 2, name: "Mom's Birthday",   icon: '🎂', date: '2026-04-12' },
  { id: 3, name: 'Anniversary',      icon: '💍', date: '2026-06-20' },
  { id: 4, name: "Best Friend's Day",icon: '🌸', date: '2026-06-08' },
];

// ─── Cart Items ──────────────────────────────────────────────────────────────
export const INITIAL_CART = [
  { id: 1, name: 'Whisper of Spring', custom: 'Roses, Pink tones, Medium, Satin Ribbon', price: 1299, img: '💐', msg: 'Happy Birthday!' },
  { id: 2, name: 'Velvet Dusk',       custom: 'Ready bouquet, Large',                    price: 1899, img: '🌹', msg: '' },
];

// ─── Team ────────────────────────────────────────────────────────────────────
export const TEAM = [
  { name: 'Priya Sharma',   role: 'Founder & CEO',     bio: 'Florist for 12 years, dreamer, chai lover ☕', av: '👩‍🌾' },
  { name: 'Arjun Das',      role: 'Head of Tech',      bio: 'Turning code into garden paths 🌿',            av: '👨‍💻' },
  { name: 'Meera Patel',    role: 'Creative Director', bio: 'Arranging beauty, one stem at a time 🎨',      av: '👩‍🎨' },
  { name: 'Rohit Banerjee', role: 'Delivery Lead',     bio: 'Making sure every petal arrives perfect 🚴',   av: '🧑‍🌾' },
];

// ─── Flora AI flow ───────────────────────────────────────────────────────────
export const FLORA_FLOW = [
  { q: "What's the occasion?",        opts: ['Birthday 🎂', 'Anniversary 💍', 'Just Because 🌸', 'Romance ❤️'] },
  { q: "What's their fav colour?",    opts: ['Pink 🌸', 'Purple 💜', 'Yellow 🌻', 'White ⚪', 'Mixed 🌈'] },
  { q: "What's your budget?",         opts: ['Under ₹1,000', '₹1,000–₹2,000', '₹2,000–₹3,000', '₹3,000+'] },
  { q: 'Classic or modern style?',    opts: ['Classic 🕊️', 'Modern ✨', 'Wildflower 🌿', 'Luxury 👑'] },
];

export const FLORA_REPLIES = [
  'How lovely! 💕 Now let me ask about their favourite colour...',
  'Beautiful choice! 🎨 What\'s your budget range for this bouquet?',
  'Perfect! 💸 Last question — do they prefer a classic or modern arrangement?',
  'Wonderful! I\'ve found the perfect bouquet just for you! 🌸✨',
];

// ─── Month names ─────────────────────────────────────────────────────────────
export const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];
export const WEEK_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
