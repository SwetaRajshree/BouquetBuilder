import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #fdf8f5;
    --bg2:         #faf3ee;
    --rose:        #c9748a;
    --rose-deep:   #a85570;
    --rose-light:  #f5e6eb;
    --rose-mid:    #e8c4cd;
    --mauve:       #9b7b8a;
    --mauve-light: #ede3e8;
    --cream:       #f7efe8;
    --amber:       #c8915a;
    --amber-light: #f5e6d8;
    --text:        #3a2530;
    --text-muted:  #8a6e78;
    --white:       #ffffff;
    --border:      rgba(180,130,145,0.18);
    --font-display:'Cormorant Garamond', Georgia, serif;
    --font-body:   'DM Sans', sans-serif;
    --radius:      16px;
    --shadow:      0 8px 32px rgba(150,90,110,0.10);
    --shadow-hover:0 20px 48px rgba(150,90,110,0.18);
    --transition:  all 0.35s cubic-bezier(0.4,0,0.2,1);
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* ── NAVBAR ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 70px;
    background: rgba(253,248,245,0.88);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
  }
  .navbar.scrolled {
    height: 58px;
    background: rgba(253,248,245,0.97);
    box-shadow: 0 4px 20px rgba(150,90,110,0.08);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-display); font-size: 1.5rem; font-weight: 600;
    color: var(--rose-deep); text-decoration: none; white-space: nowrap;
    letter-spacing: 0.01em;
  }
  .nav-links { display: flex; align-items: center; gap: 2px; list-style: none; }
  .nav-links a {
    padding: 6px 14px; border-radius: 8px;
    font-size: 0.875rem; font-weight: 500;
    color: var(--text); text-decoration: none; transition: var(--transition);
  }
  .nav-links a:hover { background: var(--rose-light); color: var(--rose-deep); }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-search {
    display: flex; align-items: center;
    background: var(--rose-light); border-radius: 10px;
    padding: 6px 14px; gap: 8px;
    border: 1.5px solid transparent; transition: var(--transition);
  }
  .nav-search:focus-within { border-color: var(--rose); background: white; }
  .nav-search input {
    border: none; background: transparent; outline: none;
    font-family: var(--font-body); font-size: 0.85rem; color: var(--text); width: 150px;
  }
  .nav-search input::placeholder { color: var(--text-muted); }
  .btn-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--rose-mid); background: transparent;
    cursor: pointer; color: var(--rose); transition: var(--transition); position: relative;
  }
  .btn-icon:hover { background: var(--rose-light); border-color: var(--rose); }
  .cart-badge {
    position: absolute; top: -5px; right: -5px;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--rose); color: white;
    font-size: 0.65rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .btn-artist {
    padding: 8px 20px; border-radius: 10px;
    background: var(--rose); color: white; border: none;
    font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: var(--transition);
    animation: softPulse 2.8s ease-in-out infinite;
  }
  .btn-artist:hover { background: var(--rose-deep); transform: translateY(-1px); animation: none; }
  @keyframes softPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(201,116,138,0.35); }
    50%      { box-shadow: 0 0 0 8px rgba(201,116,138,0); }
  }

  /* ── HERO ── */
  .hero {
    margin-top: 70px; position: relative;
    height: calc(100vh - 70px); min-height: 600px; overflow: hidden;
  }
  .hero-slide {
    position: absolute; inset: 0;
    display: flex; align-items: center; padding: 0 88px;
    opacity: 0; transition: opacity 1s ease; overflow: hidden;
  }
  .hero-slide.active { opacity: 1; }
  .hero-bg {
    position: absolute; inset: -5%;
    transition: transform 9s ease; transform: scale(1.08);
  }
  .hero-slide.active .hero-bg { transform: scale(1); }
  .hero-bg-1 { background: linear-gradient(135deg, #6b2d45 0%, #a85570 40%, #c9748a 70%, #e8b4c0 100%); }
  .hero-bg-2 { background: linear-gradient(135deg, #7a5060 0%, #c8915a 50%, #e8c4a0 100%); }
  .hero-bg-3 { background: linear-gradient(135deg, #4a2535 0%, #9b7b8a 50%, #c9748a 100%); }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(30,10,20,0.55) 0%, rgba(30,10,20,0.1) 65%, transparent 100%);
  }
  .hero-petals { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .petal {
    position: absolute; width: 16px; height: 22px;
    border-radius: 60% 40% 60% 40% / 50% 50% 50% 50%;
    background: rgba(255,255,255,0.16);
    animation: floatPetal linear infinite;
  }
  @keyframes floatPetal {
    0%   { transform: translateY(110vh) rotate(0deg); opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 0.5; }
    100% { transform: translateY(-20vh) rotate(540deg); opacity: 0; }
  }
  .hero-content { position: relative; z-index: 2; max-width: 620px; color: white; }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.35);
    border-radius: 100px; padding: 6px 18px;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(255,255,255,0.9); margin-bottom: 22px;
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }
  .hero-slide.active .hero-tag { opacity: 1; transform: translateY(0); }
  .hero-title {
    font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.2rem);
    font-weight: 600; line-height: 1.12; margin-bottom: 20px; letter-spacing: -0.01em;
    opacity: 0; transform: translateX(-36px);
    transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
  }
  .hero-slide.active .hero-title { opacity: 1; transform: translateX(0); }
  .hero-sub {
    font-size: 1.05rem; color: rgba(255,255,255,0.82); margin-bottom: 36px; line-height: 1.7;
    opacity: 0; transform: translateX(-24px);
    transition: opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s;
  }
  .hero-slide.active .hero-sub { opacity: 1; transform: translateX(0); }
  .hero-btns {
    display: flex; gap: 14px; flex-wrap: wrap;
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s;
  }
  .hero-slide.active .hero-btns { opacity: 1; transform: translateY(0); }
  .btn-primary {
    padding: 13px 28px; border-radius: 12px;
    background: var(--rose); color: white; border: none;
    font-family: var(--font-body); font-size: 0.95rem; font-weight: 600;
    cursor: pointer; transition: var(--transition);
  }
  .btn-primary:hover { background: var(--rose-deep); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168,85,112,0.4); }
  .btn-outline-white {
    padding: 13px 28px; border-radius: 12px;
    background: transparent; color: white;
    border: 1.5px solid rgba(255,255,255,0.55);
    font-family: var(--font-body); font-size: 0.95rem; font-weight: 500;
    cursor: pointer; transition: var(--transition);
  }
  .btn-outline-white:hover { background: rgba(255,255,255,0.12); border-color: white; }
  .hero-dots {
    position: absolute; bottom: 36px; left: 88px; z-index: 3; display: flex; gap: 10px;
  }
  .hero-dot {
    width: 8px; height: 8px; border-radius: 4px;
    background: rgba(255,255,255,0.4); border: none; cursor: pointer; transition: var(--transition);
  }
  .hero-dot.active { width: 28px; background: white; }

  /* ── SECTIONS ── */
  .section { padding: 96px 60px; }
  .section-inner { max-width: 1280px; margin: 0 auto; }
  .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; }
  .section-label {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--rose); margin-bottom: 8px;
  }
  .section-title {
    font-family: var(--font-display); font-size: clamp(1.9rem, 3vw, 2.9rem);
    font-weight: 600; color: var(--text); line-height: 1.15; letter-spacing: -0.01em;
  }
  .btn-explore {
    padding: 10px 22px; border-radius: 10px;
    border: 1.5px solid var(--rose-mid); color: var(--rose-deep); background: transparent;
    font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: var(--transition); white-space: nowrap;
  }
  .btn-explore:hover { background: var(--rose-light); border-color: var(--rose); }

  /* fade-up */
  .fade-up { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  .fade-up-delay-1 { transition-delay: 0.1s; }
  .fade-up-delay-2 { transition-delay: 0.2s; }
  .fade-up-delay-3 { transition-delay: 0.3s; }

  /* ── OUR STORY SECTION ── */
  .join-section {
    padding: 96px 60px;
    background: linear-gradient(135deg, #fdf0f3 0%, #faeaef 100%);
    position: relative; overflow: hidden;
  }
  .join-section::before {
    content: ''; position: absolute; top: -80px; right: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,116,138,0.08), transparent);
    pointer-events: none;
  }
  .story-heading {
    font-family: var(--font-display); font-size: clamp(1.9rem, 3vw, 2.9rem);
    font-weight: 600; color: var(--text); line-height: 1.15;
    display: flex; align-items: center; justify-content: center; gap: 12px;
  }
  .join-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 28px; margin: 52px 0 44px;
  }
  .join-card {
    background: white; border-radius: var(--radius);
    padding: 36px 26px; text-align: center;
    border: 1px solid var(--rose-mid);
    box-shadow: 0 4px 18px rgba(150,90,110,0.07); transition: var(--transition);
  }
  .join-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .join-icon {
    width: 68px; height: 68px; border-radius: 20px;
    background: var(--rose-light); display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 1.9rem; transition: var(--transition);
  }
  .join-card:hover .join-icon { background: var(--rose); transform: scale(1.08) rotate(-4deg); }
  .join-card h3 { font-family: var(--font-display); font-size: 1.2rem; color: var(--text); margin-bottom: 10px; }
  .join-card p { font-size: 0.875rem; color: var(--text-muted); line-height: 1.65; }
  .join-cta { text-align: center; }
  .btn-rose-large {
    padding: 15px 38px; border-radius: 14px;
    background: var(--rose); color: white; border: none;
    font-family: var(--font-body); font-size: 1rem; font-weight: 600;
    cursor: pointer; transition: var(--transition);
    display: inline-flex; align-items: center; gap: 10px;
  }
  .btn-rose-large:hover { background: var(--rose-deep); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(168,85,112,0.32); }

  /* ── PRODUCT CARDS ── */
  .carousel-wrap { position: relative; }
  .carousel-track {
    display: flex; gap: 22px; overflow-x: auto;
    scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
    padding-bottom: 12px; cursor: grab;
  }
  .carousel-track:active { cursor: grabbing; }
  .carousel-track::-webkit-scrollbar { height: 4px; }
  .carousel-track::-webkit-scrollbar-track { background: var(--rose-light); border-radius: 2px; }
  .carousel-track::-webkit-scrollbar-thumb { background: var(--rose-mid); border-radius: 2px; }
  .carousel-arrow {
    position: absolute; top: 50%; transform: translateY(-60%);
    width: 42px; height: 42px; border-radius: 50%;
    background: white; border: 1.5px solid var(--rose-mid);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 2; color: var(--rose);
    box-shadow: var(--shadow); transition: var(--transition);
  }
  .carousel-arrow:hover { background: var(--rose); color: white; border-color: var(--rose); }
  .carousel-arrow.left { left: -20px; }
  .carousel-arrow.right { right: -20px; }
  .product-card {
    min-width: 252px; max-width: 252px;
    background: white; border-radius: var(--radius);
    overflow: hidden; scroll-snap-align: start;
    border: 1px solid var(--border);
    box-shadow: 0 4px 14px rgba(150,90,110,0.07);
    transition: var(--transition); position: relative; flex-shrink: 0;
  }
  .product-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
  .product-img-wrap {
    height: 215px; position: relative; overflow: hidden;
    background: linear-gradient(135deg, var(--rose-light), var(--mauve-light));
  }
  .product-emoji {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center; font-size: 3.8rem;
  }
  .add-to-cart {
    position: absolute; bottom: -50px; left: 0; right: 0;
    background: var(--rose); color: white;
    padding: 12px; text-align: center; font-weight: 600; font-size: 0.85rem;
    cursor: pointer; transition: var(--transition); border: none;
    font-family: var(--font-body); letter-spacing: 0.02em;
  }
  .product-card:hover .add-to-cart { bottom: 0; }
  .product-info { padding: 15px 17px 18px; }
  .product-region {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--rose); margin-bottom: 4px;
  }
  .product-name { font-family: var(--font-display); font-size: 1.05rem; color: var(--text); margin-bottom: 5px; }
  .product-artist { font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px; }
  .product-price { font-size: 1.05rem; font-weight: 700; color: var(--rose-deep); }
  .product-price span { font-size: 0.78rem; font-weight: 400; color: var(--text-muted); text-decoration: line-through; margin-left: 6px; }

  .pill-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }
  .pill {
    padding: 6px 16px; border-radius: 100px;
    border: 1.5px solid var(--rose-mid); font-size: 0.82rem; font-weight: 500;
    color: var(--rose-deep); background: transparent; cursor: pointer; transition: var(--transition);
  }
  .pill:hover, .pill.active { background: var(--rose); color: white; border-color: var(--rose); }

  .paintings-section { background: var(--cream); }

  /* ── SPOTRI ── */
  .spotri-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .spotri-card {
    border-radius: var(--radius); overflow: hidden; position: relative;
    background: white; border: 1px solid var(--border);
    box-shadow: 0 4px 14px rgba(150,90,110,0.07);
    cursor: pointer; transition: var(--transition);
  }
  .spotri-card:nth-child(2) { grid-row: span 2; }
  .spotri-card:hover { transform: scale(1.02); box-shadow: var(--shadow-hover); }
  .spotri-img {
    display: flex; align-items: center; justify-content: center;
    font-size: 3.2rem; min-height: 175px;
    background: linear-gradient(135deg, var(--rose-light), var(--mauve-light));
    transition: transform 0.4s ease;
  }
  .spotri-card:nth-child(2) .spotri-img { min-height: 378px; }
  .spotri-card:hover .spotri-img { transform: scale(1.05); }
  .spotri-badge {
    position: absolute; top: 14px; left: 14px;
    background: var(--rose); color: white;
    padding: 4px 12px; border-radius: 100px;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    opacity: 0; transform: translateY(-8px); transition: var(--transition);
  }
  .spotri-card:hover .spotri-badge { opacity: 1; transform: translateY(0); }
  .spotri-info { padding: 14px 16px; }
  .spotri-info h4 { font-family: var(--font-display); font-size: 1rem; margin-bottom: 3px; }
  .spotri-info p { font-size: 0.78rem; color: var(--text-muted); }
  .section-link {
    display: inline-flex; align-items: center; gap: 8px;
    color: var(--rose-deep); font-weight: 600; font-size: 0.9rem;
    text-decoration: none; margin-top: 28px; transition: var(--transition);
  }
  .section-link:hover { gap: 14px; color: var(--rose); }

  /* ── WOODEN ── */
  .wood-section { background: #fdf6f0; }
  .wood-split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
  .wood-featured {
    border-radius: 22px; overflow: hidden; position: relative;
    background: linear-gradient(135deg, #7a5a3a, #b08060);
    height: 490px; display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow);
  }
  .wood-featured-emoji { font-size: 7.5rem; }
  .wood-featured-badge {
    position: absolute; bottom: 22px; left: 22px; right: 22px;
    background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
    border-radius: 14px; padding: 18px 20px;
  }
  .wood-featured-badge h3 { font-family: var(--font-display); font-size: 1.2rem; color: var(--text); }
  .wood-featured-badge p { font-size: 0.82rem; color: var(--text-muted); margin: 4px 0 8px; }
  .wood-featured-badge .price { font-size: 1.25rem; font-weight: 700; color: #8b5e3c; }
  .wood-list { display: flex; flex-direction: column; gap: 14px; }
  .wood-item {
    display: flex; gap: 16px; align-items: center;
    background: white; border-radius: 14px; padding: 15px;
    border: 1px solid rgba(180,130,80,0.15);
    box-shadow: 0 2px 10px rgba(0,0,0,0.04); transition: var(--transition); cursor: pointer;
  }
  .wood-item:hover { transform: translateX(6px); box-shadow: 0 6px 22px rgba(139,94,60,0.14); }
  .wood-thumb {
    width: 68px; height: 68px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #e8d0b8, #c49a6c);
    display: flex; align-items: center; justify-content: center; font-size: 2rem;
  }
  .wood-item-info h4 { font-family: var(--font-display); font-size: 0.95rem; margin-bottom: 3px; }
  .wood-item-info p { font-size: 0.77rem; color: var(--text-muted); margin-bottom: 5px; }
  .wood-price { font-size: 0.95rem; font-weight: 700; color: #8b5e3c; }
  .wood-divider {
    height: 2px; border-radius: 2px; margin: 60px 0;
    background: linear-gradient(90deg, transparent, rgba(201,116,138,0.3), rgba(200,145,90,0.3), transparent);
  }

  /* ── STONE ── */
  .stone-section { padding: 96px 60px; background: #2e2028; position: relative; overflow: hidden; }
  .stone-section::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 6px);
  }
  .stone-section .section-label { color: var(--rose-mid); }
  .stone-section .section-title { color: white; }
  .stone-section .btn-explore { border-color: rgba(255,255,255,0.22); color: rgba(255,255,255,0.75); }
  .stone-section .btn-explore:hover { background: rgba(255,255,255,0.08); color: white; }
  .stone-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .stone-card {
    border-radius: 14px; overflow: hidden; cursor: pointer;
    background: #3e303a; border: 1px solid rgba(201,116,138,0.12);
    box-shadow: 0 4px 16px rgba(0,0,0,0.35); transition: var(--transition);
  }
  .stone-card:hover { transform: translateY(-6px); box-shadow: 0 14px 36px rgba(0,0,0,0.55); }
  .stone-img {
    height: 195px; display: flex; align-items: center; justify-content: center;
    font-size: 3.4rem; background: linear-gradient(135deg, #4a3540, #2e2028); transition: transform 0.4s ease;
  }
  .stone-card:hover .stone-img { transform: scale(1.05); }
  .stone-info { padding: 15px; color: rgba(255,255,255,0.88); }
  .stone-info h4 { font-family: var(--font-display); font-size: 0.95rem; margin-bottom: 3px; }
  .stone-info p { font-size: 0.76rem; color: rgba(255,255,255,0.45); margin-bottom: 7px; }
  .stone-price { font-size: 0.95rem; font-weight: 700; color: var(--rose-mid); }

  .lightbox {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(20,10,16,0.92); display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px);
  }
  .lightbox-content {
    background: #3e303a; border-radius: 20px; padding: 44px;
    max-width: 460px; width: 90%; text-align: center; color: white; position: relative;
    border: 1px solid rgba(201,116,138,0.2);
  }
  .lightbox-emoji { font-size: 5.5rem; margin-bottom: 18px; display: block; }
  .lightbox-close {
    position: absolute; top: 16px; right: 16px;
    background: rgba(255,255,255,0.08); border: none; color: rgba(255,255,255,0.7);
    width: 34px; height: 34px; border-radius: 50%;
    cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;
    transition: var(--transition);
  }
  .lightbox-close:hover { background: rgba(255,255,255,0.18); color: white; }

  /* ── ARTISTS ── */
  .artists-track { display: flex; gap: 22px; overflow-x: auto; padding-bottom: 12px; }
  .artists-track::-webkit-scrollbar { height: 4px; }
  .artists-track::-webkit-scrollbar-thumb { background: var(--rose-mid); border-radius: 2px; }
  .artist-card {
    min-width: 210px; background: white; border-radius: var(--radius);
    padding: 28px 20px; text-align: center; flex-shrink: 0;
    border: 1px solid var(--border);
    box-shadow: 0 4px 14px rgba(150,90,110,0.07); transition: var(--transition);
  }
  .artist-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .artist-avatar {
    width: 78px; height: 78px; border-radius: 50%;
    margin: 0 auto 15px;
    display: flex; align-items: center; justify-content: center; font-size: 2.4rem;
    border: 3px solid var(--rose-light);
    background: linear-gradient(135deg, var(--rose-light), var(--mauve-light));
  }
  .artist-name { font-family: var(--font-display); font-size: 1.05rem; color: var(--text); margin-bottom: 3px; }
  .artist-craft { font-size: 0.78rem; color: var(--text-muted); margin-bottom: 3px; }
  .artist-location { font-size: 0.73rem; color: var(--rose); font-weight: 600; margin-bottom: 12px; }
  .artist-stars { color: var(--amber); font-size: 0.82rem; margin-bottom: 15px; }
  .btn-visit {
    padding: 7px 18px; border-radius: 10px;
    border: 1.5px solid var(--rose-mid); color: var(--rose-deep);
    background: transparent; font-family: var(--font-body);
    font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: var(--transition);
  }
  .btn-visit:hover { background: var(--rose); color: white; border-color: var(--rose); }

  /* ── TESTIMONIALS ── */
  .testimonials-section { padding: 80px 60px; background: var(--rose-light); }
  .testimonials-inner { max-width: 860px; margin: 0 auto; }
  .testimonial-wrap { position: relative; min-height: 155px; }
  .testimonial {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    opacity: 0; transition: opacity 0.6s ease; padding: 0 32px;
  }
  .testimonial.active { opacity: 1; position: relative; }
  .testimonial-quote {
    font-family: var(--font-display); font-size: 1.2rem; font-style: italic;
    color: var(--text); line-height: 1.75; margin-bottom: 18px;
  }
  .testimonial-author { font-weight: 600; color: var(--rose-deep); font-size: 0.88rem; }
  .testimonial-role { font-size: 0.78rem; color: var(--text-muted); }
  .trust-bar {
    display: flex; justify-content: center; flex-wrap: wrap; gap: 30px;
    margin-top: 55px; padding-top: 44px; border-top: 1px solid var(--rose-mid);
  }
  .trust-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; color: var(--rose-deep); }
  .trust-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: white; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; box-shadow: 0 2px 10px rgba(150,90,110,0.1);
  }

  /* ── FOOTER ── */
  .footer { background: #2a1820; color: rgba(255,255,255,0.7); padding: 68px 60px 34px; }
  .footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 44px;
    max-width: 1280px; margin: 0 auto;
    padding-bottom: 44px; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .footer-brand { font-family: var(--font-display); color: white; font-size: 1.4rem; margin-bottom: 12px; }
  .footer-desc { font-size: 0.86rem; line-height: 1.75; color: rgba(255,255,255,0.45); margin-bottom: 20px; }
  .footer-socials { display: flex; gap: 10px; margin-bottom: 22px; }
  .social-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.07); border: none; color: rgba(255,255,255,0.65);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 0.95rem; transition: var(--transition);
  }
  .social-btn:hover { background: var(--rose); color: white; }
  .footer-col h4 { color: white; font-weight: 600; font-size: 0.88rem; margin-bottom: 17px; }
  .footer-col ul { list-style: none; }
  .footer-col ul li { margin-bottom: 10px; }
  .footer-col ul li a { color: rgba(255,255,255,0.45); text-decoration: none; font-size: 0.83rem; transition: var(--transition); }
  .footer-col ul li a:hover { color: rgba(255,255,255,0.9); }
  .newsletter { display: flex; gap: 8px; margin-top: 10px; }
  .newsletter input {
    flex: 1; padding: 10px 14px; border-radius: 10px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    color: white; font-family: var(--font-body); font-size: 0.83rem; outline: none; transition: var(--transition);
  }
  .newsletter input::placeholder { color: rgba(255,255,255,0.3); }
  .newsletter input:focus { border-color: var(--rose); }
  .newsletter button {
    padding: 10px 15px; border-radius: 10px;
    background: var(--rose); color: white; border: none;
    font-family: var(--font-body); font-weight: 600; font-size: 0.83rem;
    cursor: pointer; transition: var(--transition);
  }
  .newsletter button:hover { background: var(--rose-deep); }
  .footer-bottom {
    max-width: 1280px; margin: 22px auto 0;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.78rem; color: rgba(255,255,255,0.25);
  }

  @media (max-width: 1024px) {
    .nav-links { display: none; }
    .join-grid { grid-template-columns: 1fr; }
    .wood-split { grid-template-columns: 1fr; }
    .stone-gallery { grid-template-columns: repeat(2, 1fr); }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .spotri-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .section, .join-section, .testimonials-section, .stone-section, .footer { padding-left: 22px; padding-right: 22px; }
    .hero-slide { padding: 0 28px; }
    .hero-dots { left: 28px; }
    .navbar { padding: 0 20px; }
    .nav-search { display: none; }
    .stone-gallery, .footer-grid { grid-template-columns: 1fr; }
    .spotri-grid { grid-template-columns: 1fr; }
  }
`;

// ── Delicate flower SVG icon for "Our Story" ──
function FlowerIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{display:"inline-block", verticalAlign:"middle", flexShrink:0}}>
      <ellipse cx="15" cy="8.5"  rx="3.2" ry="5.6" fill="#c9748a" opacity="0.75"/>
      <ellipse cx="15" cy="8.5"  rx="3.2" ry="5.6" fill="#c9748a" opacity="0.75" transform="rotate(60 15 15)"/>
      <ellipse cx="15" cy="8.5"  rx="3.2" ry="5.6" fill="#c9748a" opacity="0.75" transform="rotate(120 15 15)"/>
      <ellipse cx="15" cy="8.5"  rx="3.2" ry="5.6" fill="#e8b4c0" opacity="0.6"  transform="rotate(180 15 15)"/>
      <ellipse cx="15" cy="8.5"  rx="3.2" ry="5.6" fill="#e8b4c0" opacity="0.6"  transform="rotate(240 15 15)"/>
      <ellipse cx="15" cy="8.5"  rx="3.2" ry="5.6" fill="#e8b4c0" opacity="0.6"  transform="rotate(300 15 15)"/>
      <circle cx="15" cy="15" r="4.2" fill="#fce4ec"/>
      <circle cx="15" cy="15" r="2.6" fill="#c9748a"/>
      <path d="M15 19.5 Q16.5 23 15 27" stroke="#7bb870" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M15 23 Q12.5 21.5 12 20" stroke="#7bb870" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

const heroSlides = [
  { tag:"🌍 Global Artisan Platform", title:"Art from Every Corner of the World", sub:"Discover handcrafted masterpieces made by skilled artisans across continents. Every piece tells a unique story.", bg:"hero-bg-1", btn1:"Explore Now", btn2:"View Collections" },
  { tag:"❤️ Support Local Artisans", title:"Shop Handmade. Change Lives.", sub:"Every purchase directly supports independent artisans and their communities.", bg:"hero-bg-2", btn1:"Shop Now", btn2:"Meet the Artists" },
  { tag:"🎨 Become a Seller", title:"Join as an Artist & Sell Globally", sub:"Turn your craft into a livelihood. Reach millions of buyers who appreciate authentic handmade art.", bg:"hero-bg-3", btn1:"Start Selling →", btn2:"Learn More" },
];
const handloomProducts = [
  {id:1,emoji:"🥻",name:"Banarasi Silk Saree",artist:"Rekha Devi",region:"Varanasi, India",price:"₹12,500",original:"₹16,000"},
  {id:2,emoji:"🧣",name:"Assam Muga Dupatta",artist:"Priya Bora",region:"Assam, India",price:"₹3,200",original:"₹4,500"},
  {id:3,emoji:"🏮",name:"Chanderi Cotton Stole",artist:"Sunita Patel",region:"Madhya Pradesh",price:"₹1,800",original:"₹2,400"},
  {id:4,emoji:"🛏️",name:"Handwoven Bed Linen",artist:"Fatima Begum",region:"Jaipur, India",price:"₹5,600",original:"₹7,000"},
  {id:5,emoji:"🧺",name:"Ikat Weave Table Cloth",artist:"Lakshmi Rao",region:"Odisha, India",price:"₹2,100",original:"₹2,800"},
  {id:6,emoji:"🪴",name:"Kashmiri Wool Carpet",artist:"Mohammad Ali",region:"Kashmir, India",price:"₹28,000",original:"₹35,000"},
];
const paintingProducts = [
  {id:1,emoji:"🎨",name:"Madhubani Forest Scene",artist:"Kamla Singh",region:"Bihar, India",price:"₹8,500",original:"₹11,000"},
  {id:2,emoji:"🖼️",name:"Warli Tribal Dance",artist:"Jyoti Hait",region:"Maharashtra",price:"₹4,200",original:"₹5,500"},
  {id:3,emoji:"🌊",name:"Watercolour Coastline",artist:"Ana Silva",region:"Goa, India",price:"₹6,800",original:"₹9,000"},
  {id:4,emoji:"🌸",name:"Floral Oil Painting",artist:"Preethi Nair",region:"Kerala, India",price:"₹15,000",original:"₹19,000"},
  {id:5,emoji:"🦚",name:"Peacock Glass Painting",artist:"Anjali Mehta",region:"Gujarat, India",price:"₹3,500",original:"₹4,800"},
  {id:6,emoji:"✏️",name:"Charcoal Portrait Sketch",artist:"Rahul Das",region:"Kolkata, India",price:"₹2,800",original:"₹3,800"},
];
const spotriProducts = [
  {id:1,emoji:"🛋️",name:"Kashmiri Embroidered Cushion",category:"Cushions",desc:"Hand-stitched floral patterns"},
  {id:2,emoji:"🎪",name:"Kantha Work Wall Hanging",category:"Wall Art",desc:"Traditional stitch art from Bengal"},
  {id:3,emoji:"🧵",name:"Phulkari Dupatta",category:"Textiles",desc:"Punjab's floral embroidery heritage"},
  {id:4,emoji:"🌺",name:"Suzani Embroidery Panel",category:"Decorative",desc:"Central Asian inspired motifs"},
  {id:5,emoji:"🎀",name:"Zardozi Work Cushion",category:"Cushions",desc:"Metallic threadwork luxury"},
  {id:6,emoji:"🦋",name:"Mirror Work Toran",category:"Wall Art",desc:"Rajasthani door hanging"},
];
const woodProducts = [
  {id:1,emoji:"🦁",name:"Saharanpur Lion Figurine",price:"₹4,500",desc:"Hand-carved teak wood"},
  {id:2,emoji:"🌿",name:"Floral Wall Panel",price:"₹12,000",desc:"Sheesham wood, intricate detail"},
  {id:3,emoji:"🐘",name:"Channapatna Elephant Set",price:"₹2,800",desc:"Lacquerware toy art"},
  {id:4,emoji:"👺",name:"Kerala Tribal Mask",price:"₹6,200",desc:"Traditional ritual art"},
];
const stoneProducts = [
  {id:1,emoji:"🪨",name:"Sandstone Ganesha",price:"₹8,500",desc:"Rajasthani stone carving"},
  {id:2,emoji:"💎",name:"Marble Inlay Box",price:"₹4,200",desc:"Agra pietra dura work"},
  {id:3,emoji:"🗿",name:"Black Granite Idol",price:"₹18,000",desc:"South Indian temple style"},
  {id:4,emoji:"🌊",name:"Pebble River Art",price:"₹1,800",desc:"Hand-painted natural stones"},
];
const artists = [
  {name:"Rekha Devi",craft:"Handloom Weaving",location:"Varanasi, India",rating:4.9,emoji:"👩‍🎨",reviews:234},
  {name:"Jyoti Hait",craft:"Warli Painting",location:"Maharashtra, India",rating:4.8,emoji:"🎨",reviews:189},
  {name:"Mohammad Ali",craft:"Carpet Weaving",location:"Kashmir, India",rating:5.0,emoji:"🧶",reviews:412},
  {name:"Ana Silva",craft:"Watercolour Art",location:"Goa, India",rating:4.7,emoji:"🖌️",reviews:156},
  {name:"Sunita Patel",craft:"Textile Art",location:"MP, India",rating:4.9,emoji:"🌸",reviews:301},
  {name:"Rahul Das",craft:"Sketching",location:"Kolkata, India",rating:4.8,emoji:"✏️",reviews:178},
];
const testimonials = [
  {quote:"I ordered a Banarasi saree as a wedding gift and the quality was absolutely breathtaking. Felt like opening a treasure chest!",author:"Priya Sharma",role:"Verified Buyer, Mumbai"},
  {quote:"As an artisan myself, finally a platform that gives us fair visibility. My sales tripled in just three months!",author:"Kamla Devi",role:"Artist, Bihar"},
  {quote:"The stone carving I bought for my living room gets compliments every single day. Truly one-of-a-kind.",author:"Arjun Mehta",role:"Verified Buyer, Delhi"},
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`navbar${scrolled?" scrolled":""}`}>
      <a href="#" className="nav-logo">
        <FlowerIcon size={28}/>
        ArtisanWorld
      </a>
      <ul className="nav-links">
        {["Home","Handloom","Paintings","Spotri","Wooden Sculpting","Stone Art","More ▾"].map(l=>(
          <li key={l}><a href="#">{l}</a></li>
        ))}
      </ul>
      <div className="nav-right">
        <div className="nav-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search artworks…"/>
        </div>
        <button className="btn-icon">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button className="btn-icon" style={{position:"relative"}}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span className="cart-badge">3</span>
        </button>
        <button className="btn-artist">Join as Artist</button>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c=>(c+1)%heroSlides.length), 4200);
    return () => clearInterval(t);
  }, []);
  const petals = Array.from({length:10},(_,i)=>({id:i,left:`${8+Math.random()*84}%`,duration:`${9+Math.random()*11}s`,delay:`${-Math.random()*16}s`}));
  return (
    <section className="hero">
      {heroSlides.map((s,i)=>(
        <div key={i} className={`hero-slide${i===current?" active":""}`}>
          <div className={`hero-bg ${s.bg}`}/>
          <div className="hero-overlay"/>
          <div className="hero-petals">
            {petals.map(p=><div key={p.id} className="petal" style={{left:p.left,animationDuration:p.duration,animationDelay:p.delay}}/>)}
          </div>
          <div className="hero-content">
            <div className="hero-tag">{s.tag}</div>
            <h1 className="hero-title">{s.title}</h1>
            <p className="hero-sub">{s.sub}</p>
            <div className="hero-btns">
              <button className="btn-primary">{s.btn1}</button>
              <button className="btn-outline-white">{s.btn2}</button>
            </div>
          </div>
        </div>
      ))}
      <div className="hero-dots">
        {heroSlides.map((_,i)=><button key={i} className={`hero-dot${i===current?" active":""}`} onClick={()=>setCurrent(i)}/>)}
      </div>
    </section>
  );
}

function OurStorySection() {
  const ref = useRef(null); const visible = useIntersection(ref);
  const steps = [
    {emoji:"📸",title:"Upload Your Artwork",desc:"Create a stunning portfolio with photos and descriptions of your handcrafted pieces."},
    {emoji:"💰",title:"Set Your Price",desc:"You're in control. Set fair prices for your work and keep up to 85% of every sale."},
    {emoji:"🌍",title:"Reach Global Buyers",desc:"Connect with customers from 120+ countries who value authentic handmade art."},
  ];
  return (
    <section className="join-section">
      <div className="section-inner" ref={ref}>
        <div style={{textAlign:"center"}} className={`fade-up${visible?" visible":""}`}>
          <div className="section-label">Our Community</div>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(1.9rem,3vw,2.9rem)",fontWeight:600,color:"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <FlowerIcon size={36}/>
            Our Story
          </h2>
          <p style={{color:"var(--text-muted)",marginTop:14,fontSize:"1rem",maxWidth:540,margin:"14px auto 0"}}>
            Are you an artisan? Join our global community — thousands of makers have already transformed their craft into a sustainable livelihood.
          </p>
        </div>
        <div className="join-grid">
          {steps.map((s,i)=>(
            <div key={i} className={`join-card fade-up fade-up-delay-${i+1}${visible?" visible":""}`}>
              <div className="join-icon">{s.emoji}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="join-cta">
          <button className="btn-rose-large">Start Selling Today →</button>
        </div>
      </div>
    </section>
  );
}

function ProductCarousel({products}) {
  const trackRef = useRef(null);
  const scroll = dir => trackRef.current?.scrollBy({left:dir*280,behavior:"smooth"});
  const drag = useRef({active:false,startX:0,scrollLeft:0});
  return (
    <div className="carousel-wrap">
      <button className="carousel-arrow left" onClick={()=>scroll(-1)}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div className="carousel-track" ref={trackRef}
        onMouseDown={e=>{drag.current={active:true,startX:e.pageX-trackRef.current.offsetLeft,scrollLeft:trackRef.current.scrollLeft};}}
        onMouseUp={()=>{drag.current.active=false;}}
        onMouseLeave={()=>{drag.current.active=false;}}
        onMouseMove={e=>{if(!drag.current.active)return;e.preventDefault();trackRef.current.scrollLeft=drag.current.scrollLeft-(e.pageX-trackRef.current.offsetLeft-drag.current.startX)*1.4;}}>
        {products.map(p=>(
          <div key={p.id} className="product-card">
            <div className="product-img-wrap">
              <div className="product-emoji">{p.emoji}</div>
              <button className="add-to-cart">Add to Cart</button>
            </div>
            <div className="product-info">
              <div className="product-region">{p.region}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-artist">by {p.artist}</div>
              <div className="product-price">{p.price}<span>{p.original}</span></div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-arrow right" onClick={()=>scroll(1)}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

function HandloomSection() {
  const ref=useRef(null);const visible=useIntersection(ref);
  const pills=["Sarees","Dupattas","Stoles","Bed Linen","Table Cloth","Carpets"];
  const [active,setActive]=useState(0);
  return (
    <section className="section"><div className="section-inner" ref={ref}>
      <div className={`section-header fade-up${visible?" visible":""}`}>
        <div><div className="section-label">Textile Heritage</div><h2 className="section-title">Handloom</h2></div>
        <button className="btn-explore">Explore All →</button>
      </div>
      <div className={`fade-up fade-up-delay-1${visible?" visible":""}`}>
        <ProductCarousel products={handloomProducts}/>
        <div className="pill-row">{pills.map((p,i)=><button key={p} className={`pill${i===active?" active":""}`} onClick={()=>setActive(i)}>{p}</button>)}</div>
      </div>
    </div></section>
  );
}

function PaintingsSection() {
  const ref=useRef(null);const visible=useIntersection(ref);
  const pills=["Watercolour","Oil Painting","Acrylic","Madhubani","Glass Painting","Sketch","Digital Art"];
  const [active,setActive]=useState(0);
  return (
    <section className="section paintings-section"><div className="section-inner" ref={ref}>
      <div className={`section-header fade-up${visible?" visible":""}`}>
        <div><div className="section-label">Fine Arts</div><h2 className="section-title">Paintings</h2></div>
        <button className="btn-explore">Explore All →</button>
      </div>
      <div className={`fade-up fade-up-delay-1${visible?" visible":""}`}>
        <ProductCarousel products={paintingProducts}/>
        <div className="pill-row">{pills.map((p,i)=><button key={p} className={`pill${i===active?" active":""}`} onClick={()=>setActive(i)}>{p}</button>)}</div>
      </div>
    </div></section>
  );
}

function SpotriSection() {
  const ref=useRef(null);const visible=useIntersection(ref);
  return (
    <section className="section" style={{background:"var(--bg2)"}}><div className="section-inner" ref={ref}>
      <div className={`section-header fade-up${visible?" visible":""}`}>
        <div><div className="section-label">Embroidery & Textile Art</div><h2 className="section-title">Spotri</h2></div>
        <button className="btn-explore">Explore All →</button>
      </div>
      <div className={`spotri-grid fade-up fade-up-delay-1${visible?" visible":""}`}>
        {spotriProducts.map(p=>(
          <div key={p.id} className="spotri-card">
            <div className="spotri-img">{p.emoji}</div>
            <span className="spotri-badge">{p.category}</span>
            <div className="spotri-info"><h4>{p.name}</h4><p>{p.desc}</p></div>
          </div>
        ))}
      </div>
      <a href="#" className="section-link">View All Spotri Art →</a>
    </div></section>
  );
}

function WoodSection() {
  const ref=useRef(null);const visible=useIntersection(ref);
  return (
    <section className="section wood-section"><div className="section-inner" ref={ref}>
      <div className={`section-header fade-up${visible?" visible":""}`}>
        <div><div className="section-label">Master Craft</div><h2 className="section-title" style={{color:"#6b4020"}}>Wooden Sculpting</h2></div>
        <button className="btn-explore" style={{borderColor:"#c49a6c",color:"#8b5e3c"}}>Explore All →</button>
      </div>
      <div className={`wood-split fade-up fade-up-delay-1${visible?" visible":""}`}>
        <div className="wood-featured">
          <div className="wood-featured-emoji">{woodProducts[0].emoji}</div>
          <div className="wood-featured-badge">
            <h3>{woodProducts[0].name}</h3><p>{woodProducts[0].desc}</p>
            <div className="price">{woodProducts[0].price}</div>
          </div>
        </div>
        <div className="wood-list">
          {woodProducts.map(p=>(
            <div key={p.id} className="wood-item">
              <div className="wood-thumb">{p.emoji}</div>
              <div className="wood-item-info"><h4>{p.name}</h4><p>{p.desc}</p><div className="wood-price">{p.price}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="wood-divider"/>
    </div></section>
  );
}

function StoneSection() {
  const ref=useRef(null);const visible=useIntersection(ref);
  const [lightbox,setLightbox]=useState(null);
  return (
    <section className="stone-section">
      <div className="section-inner" ref={ref}>
        <div className={`section-header fade-up${visible?" visible":""}`}>
          <div><div className="section-label">Ancient Craft</div><h2 className="section-title">Stone Art</h2></div>
          <button className="btn-explore">Explore All →</button>
        </div>
        <div className={`stone-gallery fade-up fade-up-delay-1${visible?" visible":""}`}>
          {stoneProducts.map(p=>(
            <div key={p.id} className="stone-card" onClick={()=>setLightbox(p)}>
              <div className="stone-img">{p.emoji}</div>
              <div className="stone-info"><h4>{p.name}</h4><p>{p.desc}</p><div className="stone-price">{p.price}</div></div>
            </div>
          ))}
        </div>
      </div>
      {lightbox&&(
        <div className="lightbox" onClick={()=>setLightbox(null)}>
          <div className="lightbox-content" onClick={e=>e.stopPropagation()}>
            <button className="lightbox-close" onClick={()=>setLightbox(null)}>✕</button>
            <span className="lightbox-emoji">{lightbox.emoji}</span>
            <h2 style={{fontFamily:"var(--font-display)",color:"white",marginBottom:8}}>{lightbox.name}</h2>
            <p style={{color:"rgba(255,255,255,0.5)",marginBottom:16}}>{lightbox.desc}</p>
            <div style={{fontSize:"1.4rem",color:"var(--rose-mid)",fontWeight:700,marginBottom:22}}>{lightbox.price}</div>
            <button className="btn-primary" style={{margin:"0 auto"}}>Add to Cart</button>
          </div>
        </div>
      )}
    </section>
  );
}

function ArtistsSection() {
  const ref=useRef(null);const visible=useIntersection(ref);
  return (
    <section className="section"><div className="section-inner" ref={ref}>
      <div className={`section-header fade-up${visible?" visible":""}`}>
        <div><div className="section-label">Meet the Makers</div><h2 className="section-title">Featured Artists Spotlight</h2></div>
        <button className="btn-explore">View All →</button>
      </div>
      <div className={`artists-track fade-up fade-up-delay-1${visible?" visible":""}`}>
        {artists.map((a,i)=>(
          <div key={i} className="artist-card">
            <div className="artist-avatar">{a.emoji}</div>
            <div className="artist-name">{a.name}</div>
            <div className="artist-craft">{a.craft}</div>
            <div className="artist-location">📍 {a.location}</div>
            <div className="artist-stars">{"★".repeat(Math.floor(a.rating))} {a.rating} ({a.reviews})</div>
            <button className="btn-visit">Visit Shop</button>
          </div>
        ))}
      </div>
    </div></section>
  );
}

function TestimonialsSection() {
  const [current,setCurrent]=useState(0);
  const ref=useRef(null);const visible=useIntersection(ref);
  useEffect(()=>{const t=setInterval(()=>setCurrent(c=>(c+1)%testimonials.length),5200);return()=>clearInterval(t);},[]);
  const trust=[{icon:"🔒",label:"Secure Payments"},{icon:"✅",label:"Verified Artisans"},{icon:"🚚",label:"Worldwide Delivery"},{icon:"↩️",label:"30-day Returns"}];
  return (
    <section className="testimonials-section" ref={ref}>
      <div className="testimonials-inner">
        <div style={{textAlign:"center",marginBottom:40}} className={`fade-up${visible?" visible":""}`}>
          <div className="section-label">What People Say</div>
          <h2 className="section-title">Loved by Buyers & Artists</h2>
        </div>
        <div className={`testimonial-wrap fade-up fade-up-delay-1${visible?" visible":""}`}>
          {testimonials.map((t,i)=>(
            <div key={i} className={`testimonial${i===current?" active":""}`}>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-role">{t.role}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:22}}>
          {testimonials.map((_,i)=>(
            <button key={i} onClick={()=>setCurrent(i)}
              style={{width:i===current?26:8,height:8,borderRadius:4,background:i===current?"var(--rose)":"var(--rose-mid)",border:"none",cursor:"pointer",transition:"all 0.35s ease"}}/>
          ))}
        </div>
        <div className={`trust-bar fade-up fade-up-delay-2${visible?" visible":""}`}>
          {trust.map(t=>(
            <div key={t.label} className="trust-item">
              <div className="trust-icon">{t.icon}</div>{t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cats=["Handloom","Paintings","Spotri","Wooden Sculpting","Stone Art","Jewellery","Pottery"];
  const sell=["Become a Seller","Seller Guidelines","Pricing & Fees","Artist Resources","Community Forum"];
  const about=["About Us","Our Mission","Blog","Press Kit","Careers","Partners"];
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">🌸 ArtisanWorld</div>
          <p className="footer-desc">Connecting artisans and art-lovers across the globe. Every purchase supports a craftsperson and their heritage.</p>
          <div className="footer-socials">
            {["𝕏","f","in","📷","▶"].map((s,i)=><button key={i} className="social-btn">{s}</button>)}
          </div>
          <p style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.32)",marginBottom:8}}>Subscribe to our newsletter</p>
          <div className="newsletter">
            <input placeholder="Your email address"/>
            <button>Subscribe</button>
          </div>
        </div>
        <div className="footer-col"><h4>About</h4><ul>{about.map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
        <div className="footer-col"><h4>Categories</h4><ul>{cats.map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
        <div className="footer-col">
          <h4>Sell With Us</h4><ul>{sell.map(l=><li key={l}><a href="#">{l}</a></li>)}</ul>
          <div style={{marginTop:18}}><h4>Contact</h4><ul>
            <li><a href="#">support@artisanworld.com</a></li>
            <li><a href="#">+91 98765 43210</a></li>
            <li><a href="#">Live Chat</a></li>
          </ul></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 ArtisanWorld. All rights reserved.</span>
        <div style={{display:"flex",gap:18}}>
          {["Privacy Policy","Terms of Service","Cookie Policy"].map(l=>(
            <a key={l} href="#" style={{color:"rgba(255,255,255,0.25)",textDecoration:"none",fontSize:"0.76rem"}}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function HandcraftPage() {
  return (
    <>
      <style>{styles}</style>
      <Navbar/>
      <button
        onClick={() => window.history.back()}
        style={{
          position: 'fixed', top: 80, left: 20, zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(253,248,245,0.92)', backdropFilter: 'blur(10px)',
          border: '1.5px solid var(--rose-mid)', borderRadius: 12,
          padding: '8px 16px', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          fontWeight: 600, color: 'var(--rose-deep)',
          boxShadow: '0 4px 16px rgba(150,90,110,0.12)',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--rose)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--rose)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(253,248,245,0.92)'; e.currentTarget.style.color = 'var(--rose-deep)'; e.currentTarget.style.borderColor = 'var(--rose-mid)'; }}
      >
        ← Back
      </button>
      <HeroSection/>
      <OurStorySection/>
      <HandloomSection/>
      <PaintingsSection/>
      <SpotriSection/>
      <WoodSection/>
      <StoneSection/>
      <ArtistsSection/>
      <TestimonialsSection/>
      <Footer/>
    </>
  );
}
