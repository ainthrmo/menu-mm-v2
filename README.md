# Mee Nhuu — Digital QR Menu

> A simple, modern digital menu platform for restaurants and cafés in Myanmar.

**Mee Nhuu (မီနှုး)** helps restaurants create, manage, and publish a mobile-friendly digital menu that customers can access by scanning a QR code.

The project is designed with Myanmar restaurants in mind, with support for **Burmese and English**, MMK pricing, restaurant branding, and an easy-to-use management dashboard.

---

## Features

### Restaurant Dashboard

* Secure restaurant authentication
* Mobile-first admin dashboard
* Restaurant profile management
* Restaurant logo upload
* Social media and contact information
* Menu item management
* Add, edit, and delete menu items
* Menu item availability toggle
* Category management
* Search and category filtering
* Real-time updates through Supabase

### Digital Menu

* Mobile-first customer experience
* Restaurant branding
* Menu categories
* Food images
* Menu item names and prices
* MMK currency formatting
* Available/unavailable menu items
* Burmese and English content support

### QR Code

* Generate a restaurant-specific QR code
* Branded QR code with restaurant logo
* Preview the live digital menu
* Copy menu URL
* Download QR code as PNG
* QR code optimized for physical restaurant use

---

## Product Flow

```text
Restaurant
    │
    ▼
Create Account
    │
    ▼
Admin Dashboard
    │
    ├── Restaurant Profile
    ├── Categories
    ├── Menu Items
    └── QR Code
            │
            ▼
      Download / Print
            │
            ▼
        Customer
            │
            ▼
       Scan QR Code
            │
            ▼
      Digital Menu
```

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide Icons

### Backend / Infrastructure

* Supabase

  * Authentication
  * PostgreSQL database
  * Storage
  * Row Level Security

### QR

* `qrcode.react`

### Deployment

* Vercel
* GitHub

---

## Project Structure

```text
menu-mm-v2/
│
├── app/
│   ├── auth/
│   ├── menu/
│   ├── protected/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── AdminDashboard.tsx
│   ├── QrCodeGenerator.tsx
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── store.ts
│   └── utils.ts
│
├── public/
│
├── types/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd menu-mm-v2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Then add your Supabase credentials.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

> Never commit `.env.local` or real API keys to Git.

### 4. Set up Supabase

Create a Supabase project and configure:

* Authentication
* PostgreSQL tables
* Storage bucket
* Row Level Security policies

The application currently uses tables for:

```text
store_profile
categories
menu_items
```

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

The repository contains `.env.example` as a template.

Do not commit:

```text
.env
.env.local
.env.production
.env.*.local
```

Only placeholder values should be stored in `.env.example`.

---

## Database

The current MVP uses Supabase for persistent application data.

### Store Profile

Stores restaurant information such as:

* Restaurant name
* Logo
* Facebook
* Instagram
* TikTok
* Messenger
* Phone number

### Categories

Stores menu categories such as:

```text
Main Dishes
Noodles
Drinks
Desserts
```

### Menu Items

Stores:

* Name
* Category
* Price
* Image
* Availability
* Creation timestamp

---

## Design Principles

Mee Nhuu follows a **mobile-first** approach because most restaurant customers will access the menu from their phones.

The UI focuses on:

* Simple navigation
* Large touch targets
* Clear menu hierarchy
* Fast access to restaurant information
* Accessible interactions
* High readability
* Minimal visual clutter
* Consistent branding

The primary brand color is:

```text
Mee Nhuu Teal
#0B7A5F
```

The interface uses warm neutral backgrounds to complement food photography and improve readability.

---

## Localization

Mee Nhuu is designed for the Myanmar market.

The product supports:

* English
* Burmese / Myanmar

Localization is intended to cover both the restaurant management experience and the customer-facing digital menu.

---

## MVP Scope

The current MVP focuses on one core problem:

> **Help restaurants replace printed menus with a simple digital QR menu.**

### Included

* Restaurant authentication
* Restaurant profile
* Menu management
* Category management
* Image uploads
* Digital menu
* QR generation
* Branded QR download
* Mobile-first experience

### Future Roadmap

Mee Nhuu is planned to evolve into a broader restaurant technology platform.

Potential future products include:

```text
Digital QR Menu
      ↓
POS
      ↓
Order Management
      ↓
Kitchen Display System
      ↓
Inventory
      ↓
Sales Analytics
      ↓
Customer Loyalty
      ↓
Restaurant Management Platform
```

These features are **not part of the current MVP**.

---

## Development

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

## Security

This project uses Supabase authentication and database security policies.

Important rules:

* Never commit API keys or service-role keys.
* Never expose Supabase service-role credentials to the browser.
* Keep private environment variables in `.env.local`.
* Use Row Level Security for protected database resources.
* Rotate any credential that has accidentally been exposed.

---

## Status

**Current status: MVP development**

The core QR menu workflow is functional:

```text
Restaurant Login
       ↓
Admin Dashboard
       ↓
Manage Menu
       ↓
Generate QR
       ↓
Download QR
       ↓
Customer Scans
       ↓
Digital Menu
```

The project is currently being prepared for production testing with Myanmar restaurants.

---

## Contributing

This project is currently under active development.

For significant changes, create a separate branch and open a pull request.

```bash
git checkout -b feature/your-feature
```

Make your changes, commit them, and push the branch.

---

## License

This project is currently private / proprietary.

All rights reserved.

---

## Mee Nhuu

**မီနှုး — Digital menus made simple.**

Built to help Myanmar restaurants move from printed menus to a modern digital experience.
