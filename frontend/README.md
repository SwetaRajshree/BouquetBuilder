# 💐 BouquetBuilder

> **Send Love, One Petal at a Time** — A premium flower delivery web app built with React + Vite + Tailwind CSS.

---

## ✨ Features

| Page | Route | Description |
|------|-------|-------------|
| 🏠 Home | `/` | Hero, flash sale strip, featured shops, occasions, How It Works |
| 🔥 Flash Sale | `/sale` | Big countdown timer, sale cards with stock bars & urgency badges |
| 🗺️ Nearby Shops | `/shops` | Split list + map layout, location share toggle, live distance |
| 🌹 Shop | `/shop/:id` | Ready bouquets, 6-step customizer, packages tab |
| 📦 Subscriptions | `/subscription` | Plan cards, comparison table, customize plan, My Subscriptions |
| 📅 Schedule | `/schedule` | Calendar picker, time slots, recipient form, message card preview |
| 🤖 Flora AI | `/ai` | Guided chat flow, quick reply chips, suggested bouquet |
| 🗓️ Calendar | `/calendar` | Special days calendar, add occasion modal, upcoming list |
| 💳 Payment | `/payment` | Multi-method selector, card form, confetti burst on success |
| 🛒 Cart | `/cart` | Cart items, delivery toggle, promo code, flash sale notice |
| 📦 Tracking | `/tracking` | Live map with moving delivery pin, order stepper, driver card |
| 💐 Our Story | `/story` | Editorial layout, team, values, stats, newsletter signup |

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** — utility-first styling
- **React Router DOM 6** — client-side routing
- **Framer Motion** — animation library (ready to use)
- **Lucide React** — icon library (ready to use)
- **Google Fonts** — Playfair Display + Poppins + Dancing Script

---

## 📁 Project Structure

```
bouquetbuilder/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root with React Router <Routes>
    ├── styles/
    │   └── index.css         # Tailwind directives + global CSS variables & keyframes
    ├── data/
    │   └── mockData.js       # All dummy/mock data (shops, bouquets, occasions, etc.)
    ├── hooks/
    │   ├── useCountdown.js   # Live countdown timer hook
    │   └── useCart.js        # Cart state hook
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── FallingPetals.jsx
    │   ├── FlashSaleStrip.jsx
    │   ├── ShopCard.jsx
    │   ├── BouquetCard.jsx
    │   ├── PackageCard.jsx
    │   ├── FlashSaleCard.jsx
    │   ├── MessageCardPreview.jsx
    │   ├── CustomizationStepper.jsx
    │   ├── FloraChat.jsx
    │   ├── SpecialDayModal.jsx
    │   ├── DateTimePicker.jsx
    │   ├── OrderStepper.jsx
    │   ├── LiveLocationMap.jsx
    │   └── PaymentMethodSelector.jsx
    └── pages/
        ├── HomePage.jsx
        ├── FlashSalePage.jsx
        ├── ShopsPage.jsx
        ├── ShopPage.jsx
        ├── SubscriptionPage.jsx
        ├── SchedulePage.jsx
        ├── AIPage.jsx
        ├── CalendarPage.jsx
        ├── PaymentPage.jsx
        ├── CartPage.jsx
        ├── TrackingPage.jsx
        └── OurStoryPage.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (LTS recommended)
- **npm** v9+ or **yarn** v1.22+

### Installation

```bash
# 1. Clone or unzip the project
cd bouquetbuilder

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--blush` | `#FFB6C1` | Primary accent, badges, backgrounds |
| `--lavender` | `#E6CFFF` | Secondary accent, Flora chat bubbles |
| `--cream` | `#FFF8F0` | Page background |
| `--sage` | `#B5CDA3` | Success states, subscription badges |
| `--rose` | `#C9848A` | Borders, interactive elements |
| `--rose-d` | `#a86870` | Primary text accent |
| `--rose-dd` | `#8a5560` | Headings, strong emphasis |

### Typography

| Font | Usage |
|------|-------|
| **Playfair Display** | All headings (h1–h5), prices, logo |
| **Poppins** | Body text, labels, buttons, inputs |
| **Dancing Script** | Message card Cursive font option |

### Tailwind Custom Classes

All custom design tokens are available as Tailwind utilities:

```jsx
// Colors
className="text-roseDD bg-blush border-rose"

// Shadows
className="shadow-soft-s shadow-soft-m shadow-soft-l"

// Border radius
className="rounded-sm rounded-md rounded-lg rounded-xl"

// Fonts
className="font-playfair font-poppins font-dancing"
```

---

## 🧩 Key Components

### `<CustomizationStepper />`
6-step bouquet builder: Flowers → Colors → Size → Wrapping → Ribbon → Message Card with live preview.

### `<FloraChat />`
AI chat UI with a guided 4-question flow (occasion → color → budget → style) that reveals a bouquet suggestion.

### `<MessageCardPreview />`
Live preview component that reflects the selected message text, font (Cursive/Print/Elegant), and card color in real-time.

### `<DateTimePicker />`
Full calendar with month navigation + morning/afternoon/evening time slot selection. Exposes `onDateChange` and `onTimeChange` callbacks.

### `<LiveLocationMap />`
Animated map placeholder with a moving delivery scooter pin and a pulsing customer pin.

### `<PaymentMethodSelector />`
Radio-style method selector (Card/Wallets/Net Banking/COD/Gift Card) with a contextual card form that appears for the Card option.

---

## 🔌 Adding Real APIs

The app is built with mock data. To wire up a real backend:

1. **Replace `src/data/mockData.js`** with API calls using `fetch` or `axios`
2. **Flora AI** — swap the hardcoded replies in `FloraChat.jsx` with an OpenAI / Anthropic API call
3. **Maps** — replace `LiveLocationMap.jsx` with Google Maps or Mapbox
4. **Payments** — replace `PaymentMethodSelector.jsx` with Stripe Elements or Razorpay SDK

---

## 📱 Mobile Responsive

All pages are fully responsive. Key breakpoints:
- `md` (768px) — two-column layouts collapse to single column
- `lg` (1024px) — sidebar layouts activate

The Navbar hides the link row on mobile (`hidden md:flex`).

---

## 🌸 Animations

All animations are defined in `src/styles/index.css` as `@keyframes` and applied via Tailwind's `animate-[]` arbitrary values or utility classes:

| Animation | Class / Style | Used in |
|-----------|---------------|---------|
| Page enter | `.page-enter` | All pages |
| Falling petals | `.petal` + `petalFall` | Hero, Flash Sale, Story |
| Flash gradient shift | `gradShift` | Flash Sale strip |
| Countdown blink | `cdBlink` | All countdowns |
| Badge pulse | `pulseBadge` | Urgency badges |
| Flora avatar glow | `floraGlow` | AI page |
| Moving delivery pin | `movingPin` + `.moving-pin` | Tracking map |
| Chat bubble enter | `bubIn` | Flora chat |
| Modal enter | `moIn` + `ovIn` | Special Day modal |
| Confetti burst | `cBurst` | Payment success |
| Location pin pulse | `youPulse` | Maps |

---

## 💡 Tips

- **Promo code**: Try `BLOOM20` on the Cart page for ₹200 off
- **Flora AI**: Answer all 4 questions to reveal the suggested bouquet
- **Payment success**: Complete the payment flow to see the confetti burst animation
- **Shop customizer**: Go to any Shop page → Customize tab → complete all 6 steps

---

*Made with 💕 — BouquetBuilder 2025*
