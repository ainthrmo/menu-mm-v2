# MOSSQR

> Digital QR menus for restaurants and cafés.

MOSSQR helps restaurants create and manage a mobile-friendly digital menu that customers can open instantly by scanning a QR code.

Built with a simple goal: **make menu updates easier without reprinting the entire menu.**

**Website:** https://getmossqr.com

---

## Product Overview

MOSSQR gives restaurant owners a simple dashboard to manage their digital menu, while customers get a fast, phone-friendly browsing experience.

**Restaurant owner**
→ Manage menu  
→ Update prices & availability  
→ Generate QR code  
→ Place QR at the restaurant

**Customer**
→ Scan QR  
→ Open menu  
→ Browse categories & dishes  
→ View restaurant information

---

## Features

### Digital Menu
- Mobile-first customer experience
- Burmese & English support
- Menu categories
- Food images
- Prices in MMK
- Availability / sold-out toggle
- Restaurant profile and contact information

### Restaurant Dashboard
- Secure authentication
- Menu item management
- Category management
- Image uploads
- Restaurant profile management
- Social links and Wi-Fi information
- Search and filtering

### QR Code
- Restaurant-specific QR code
- Branded QR code with restaurant logo
- Live menu preview
- Download QR code as PNG
- Shareable menu URL

---

## Screenshots

Screenshots will be added here as the product UI is finalized.

| Restaurant Dashboard | Digital Menu |
| --- | --- |
| Coming soon | Coming soon |

| QR Code | Mobile Experience |
| --- | --- |
| Coming soon | Coming soon |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Security | Row Level Security |
| QR | qrcode.react |
| Deployment | Vercel |
| Version Control | GitHub |

---

## Getting Started

### Prerequisites

- Node.js
- npm
- Supabase project

### Installation

```bash
git clone https://github.com/ainthrmo/menu-mm-v2.git
cd menu-mm-v2
npm install
```

Create `.env.local` from `.env.example` and add your Supabase credentials.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Roadmap

### Current
- [x] Digital QR menu
- [x] Restaurant dashboard
- [x] Menu & category management
- [x] Food image uploads
- [x] Availability toggle
- [x] Burmese & English support
- [x] QR code generation
- [x] Restaurant profile

### Next
- [ ] Production launch
- [ ] Onboard first restaurants
- [ ] Improve menu customization
- [ ] Menu update history
- [ ] Scheduled menu changes
- [ ] Customer menu issue reporting

### Future
- [ ] Restaurant analytics
- [ ] POS integrations
- [ ] Ordering
- [ ] Inventory tools
- [ ] Broader restaurant management features

> The roadmap is subject to change based on customer feedback and product validation.

---

## Project Structure

```text
menu-mm-v2/
├── app/
├── components/
├── lib/
├── public/
├── types/
├── .env.example
├── package.json
└── README.md
```

---

## Product Principles

MOSSQR is built around a few principles:

- **Simple** — restaurant owners should not need technical skills.
- **Mobile-first** — customers primarily access menus from their phones.
- **Fast to update** — menu changes should not require reprinting.
- **Practical** — features are added based on real restaurant needs.

---

## Status

**MVP — preparing for real-world restaurant testing.**

MOSSQR is currently focused on validating the core QR menu workflow with restaurants before expanding into additional restaurant technology.

---

## License

MOSSQR is proprietary software. All rights reserved.

---

**MOSSQR**  
Digital menus for restaurants & cafés.
