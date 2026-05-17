# IMPAQ OPTICS — React + Vite

Pixel-accurate Figma-to-code conversion of the IMPAQ OPTICS navbar.

## Tech Stack
- **React 18** + **Vite 5**
- Plain **CSS** (no extra libraries)
- Google Fonts — *Barlow Condensed* (logo) + *Barlow* (nav links)

## Project Structure

```
impaq-optics/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── index.css          ← global reset & CSS variables
    ├── App.jsx
    ├── App.css
    └── components/
        └── Navbar/
            ├── index.js
            ├── Navbar.jsx ← component logic
            └── Navbar.css ← all navbar styles
```

## Features

| Feature | Detail |
|---|---|
| Logo | Barlow Condensed 900, uppercase, left-aligned |
| Nav links | Home · Support · About · Contact with animated underline |
| Sign up | Bordered CTA with fill-on-hover animation |
| Active state | Tracks current page link |
| Scroll shadow | Navbar gains shadow after 10px scroll |
| Mobile menu | Hamburger → animated X, smooth slide-down dropdown |
| Responsive | Breakpoints at 768px and 480px |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
