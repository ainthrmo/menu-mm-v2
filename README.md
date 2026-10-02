# MOSSQR

> Digital QR menus for restaurants, cafés and hotels.

MOSSQR lets any food business publish a fast, mobile-friendly digital menu that customers open by scanning a QR code. Update a price or mark a dish sold out once, and it is live instantly. No reprinting.

**Website:** https://getmossqr.com

---

## How It Works

**Restaurant owner**
→ Sign up and set up the restaurant profile
→ Add categories and dishes
→ Download the QR code
→ Place it on tables, counters or windows
→ Update the menu any time

**Customer**
→ Scan the QR code
→ Browse categories and dishes in their language
→ See prices, photos, availability and restaurant info

The QR code points to a permanent menu URL, so a printed code never needs to change.

---

## Features

### Customer Menu
- Mobile-first, fast on slow connections
- Burmese and English with an instant language toggle
- Categories, dish photos, descriptions and prices
- Sold-out indicators
- Restaurant info: hours, contact, social links and Wi-Fi details

### Restaurant Dashboard
- Secure sign-in
- Dish and category management (create, edit, reorder, hide, delete)
- Image upload with automatic optimization
- Restaurant profile management
- Search and filtering
- Plan limits shown in the dashboard

### QR Code
- Restaurant-specific QR code with logo in the center
- Live menu preview
- PNG download
- Shareable menu link

---

## Architecture

MOSSQR is a multi-tenant application. Every restaurant's data is isolated with Row Level Security, so one business can never read or change another's.

### Design principles
1. **The QR code never changes.** Stable slug URLs, flexible content behind them.
2. **The public menu is the priority.** It must load quickly on weak mobile networks.
3. **Global by design.** Language, currency and timezone are settings, not assumptions.
4. **Simple for owners.** A single café should never see complexity built for a hotel group.

### Data model (target)

```text
Organization            e.g. a café, or a hotel group
 ├─ Members & roles     owner, manager, staff
 ├─ Plan & limits
 └─ Venues              e.g. main restaurant, pool bar
     ├─ Settings        currency, timezone, languages
     ├─ Menus           all-day, breakfast, drinks, room service
     │   └─ Categories → Dishes
     │        └─ Translations (language, name, description)
     └─ QR codes
```

A single café is one organization with one venue and one menu. A hotel or resort uses the same structure with several venues and menus.

### Key decisions
- **Translations table** instead of fixed language columns, so new languages need no schema change.
- **Prices stored as integers** in the smallest currency unit, with a currency code per venue.
- **Image paths stored, not full URLs**, so the storage provider can change without touching menu data.
- **Edge-cached public menus** so scans do not hit the database every time.

### Image delivery
Images are optimized on upload (WebP, resized, around 100 KB) and served through a CDN on MOSSQR's own domain. This keeps menus fast and reachable on mobile networks where third-party storage domains can be unreliable.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Security | Row Level Security |
| Image storage | Supabase Storage (migrating to Cloudflare R2 + CDN) |
| QR | qrcode.react |
| Deployment | Vercel |
| Version control | GitHub |

---

## Getting Started

### Prerequisites
- Node.js
- npm
- A Supabase project

### Installation

```bash
git clone https://github.com/ainthrmo/menu-mm-v2.git
cd menu-mm-v2
npm install
```

 

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Security notes
- Never commit `.env.local` or any secret key.
- Server-only keys must never use the `NEXT_PUBLIC_` prefix.

---

## Project Structure

```text
menu-mm-v2/
├── app/            Routes and pages
├── components/     UI components
├── lib/            Helpers and clients
├── public/         Static assets
├── types/          TypeScript types
├── .env.example
├── package.json
└── README.md
```

---

## Roadmap

### Done
- [x] Digital QR menu
- [x] Restaurant dashboard
- [x] Dish and category management
- [x] Image uploads
- [x] Sold-out toggle
- [x] Burmese and English support
- [x] QR code generation with logo
- [x] Restaurant profile

### Now
- [ ] Image delivery through R2 + CDN
- [ ] Organization → venue → menu hierarchy
- [ ] Translations table for additional languages
- [ ] Per-venue currency and timezone
- [ ] Plan limit enforcement
- [ ] Super admin area (restaurants, plans, usage)
- [ ] Basic scan counter
- [ ] Production launch and first restaurants

### Next
- [ ] Menu customization
- [ ] Menu update history
- [ ] Scheduled menu changes
- [ ] International billing
- [ ] Custom domains
- [ ] Team roles

### Later
- [ ] Analytics
- [ ] POS and hotel-system integrations
- [ ] Ordering
- [ ] Public API

> The roadmap changes based on what restaurants actually need.

---

## Status

**MVP, preparing for real-world restaurant testing.**

The focus is validating the core QR menu workflow with real restaurants before adding more.

---

## License

MOSSQR is proprietary software. All rights reserved.

---

**MOSSQR**
Digital menus for restaurants, cafés and hotels.
