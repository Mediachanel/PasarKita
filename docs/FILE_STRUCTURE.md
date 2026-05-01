# File Structure - Pasar Kita

## 📁 Complete Project Directory

```
pasar-kita/
├── src/
│   ├── app/                           # Next.js App Router (main application)
│   │   ├── layout.tsx                 # Root layout with fonts, metadata
│   │   ├── globals.css                # Global styles, Tailwind config, custom classes
│   │   ├── page.tsx                   # Home/landing page
│   │   │
│   │   ├── auth/                      # Authentication pages
│   │   │   ├── login/page.tsx         # Login form
│   │   │   └── register/page.tsx      # Registration form
│   │   │
│   │   ├── browse/                    # Buyer: Product listing
│   │   │   └── page.tsx               # Browse with filters, search, sort
│   │   │
│   │   ├── product/                   # Buyer: Product detail
│   │   │   └── [id]/page.tsx          # Dynamic product detail page
│   │   │
│   │   ├── cart/                      # Buyer: Shopping cart
│   │   │   └── page.tsx               # Cart display, quantity management
│   │   │
│   │   ├── checkout/                  # Buyer: Checkout flow
│   │   │   └── page.tsx               # Multi-step checkout (address/shipping/payment)
│   │   │
│   │   ├── orders/                    # Buyer: Order history
│   │   │   └── page.tsx               # Order listing with status
│   │   │
│   │   ├── order-success/             # Buyer: Order confirmation
│   │   │   └── [id]/page.tsx          # Success page after order creation
│   │   │
│   │   ├── seller/                    # Seller dashboard
│   │   │   ├── dashboard/page.tsx     # Seller dashboard with stats
│   │   │   ├── products/              # Seller: Product management
│   │   │   │   ├── page.tsx           # Products list/table
│   │   │   │   └── new/page.tsx       # Add new product form
│   │   │   ├── orders/page.tsx        # Seller: Incoming orders
│   │   │   └── setup/page.tsx         # Seller: Onboarding wizard
│   │   │
│   │   ├── admin/                     # Admin dashboard
│   │   │   ├── dashboard/page.tsx     # Admin overview and stats
│   │   │   └── users/page.tsx         # User management table
│   │   │
│   │   ├── help/                      # Help & support
│   │   │   └── page.tsx               # FAQ page
│   │   │
│   │   ├── about/                     # About page
│   │   │   └── page.tsx               # Company info, team, values
│   │   │
│   │   └── api/                       # API routes
│   │       └── auth/
│   │           └── login/route.ts     # Login endpoint (mock)
│   │
│   ├── components/                    # Reusable components
│   │   ├── Header.tsx                 # Navigation header with logo
│   │   └── Footer.tsx                 # Footer with links
│   │
│   └── lib/                           # Utilities and helpers
│       ├── utils.ts                   # Helper functions (format, validate, etc)
│       ├── hooks.ts                   # Custom React hooks
│       └── db.ts                      # Prisma client (setup for DB integration)
│
├── prisma/                            # Database configuration
│   ├── schema.prisma                  # Prisma schema (18+ models)
│   └── migrations/                    # PostgreSQL migrations
│
├── scripts/                           # Utility scripts
│   └── seed.js                        # Database seeding script
│
├── public/                            # Static assets
│   ├── fonts/                         # Custom fonts
│   └── uploads/                       # User uploads (images, files)
│
├── docs/                              # Documentation
│   ├── API.md                         # API endpoints documentation
│   ├── DATABASE.md                    # Database schema documentation
│   ├── USER_GUIDE.md                  # User guide by role
│   ├── INTEGRATION.md                 # Third-party integrations
│   ├── DEPLOYMENT.md                  # Deployment guide
│   └── FILE_STRUCTURE.md              # This file
│
├── Configuration Files
│   ├── package.json                   # Dependencies and scripts
│   ├── package-lock.json              # Locked dependency versions
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── next.config.js                 # Next.js configuration
│   ├── tailwind.config.ts             # Tailwind CSS theme and config
│   ├── postcss.config.js              # PostCSS configuration
│   ├── .eslintrc.json                 # ESLint rules
│   ├── .gitignore                     # Git ignore patterns
│   ├── .env.local                     # Local environment variables (not committed)
│   ├── .env.example                   # Template for environment variables
│   └── .env.production                # Production environment (example)
│
├── Documentation Root
│   ├── README.md                      # Main project documentation
│   ├── QUICKSTART.md                  # Quick start guide
│   ├── CONTRIBUTING.md                # Contributing guidelines
│   ├── CHANGELOG.md                   # Version history
│   └── LICENSE                        # Project license (if applicable)
│
└── .git/                              # Git repository (local version control)

```

## 📊 Files by Category

### Core Application Structure
- **src/app/layout.tsx** - Root layout wrapper
- **src/app/globals.css** - Global styles (200+ lines)
- **src/app/page.tsx** - Home page

### Authentication (20+ lines each)
- **src/app/auth/login/page.tsx** - Login interface
- **src/app/auth/register/page.tsx** - Registration interface

### Buyer Pages (50-150 lines each)
- **src/app/browse/page.tsx** - Product listing (12 items, searchable)
- **src/app/product/[id]/page.tsx** - Product detail (specs, reviews, add to cart)
- **src/app/cart/page.tsx** - Shopping cart management
- **src/app/checkout/page.tsx** - Multi-step checkout
- **src/app/orders/page.tsx** - Order history
- **src/app/order-success/[id]/page.tsx** - Confirmation page

### Seller Pages (50-150 lines each)
- **src/app/seller/dashboard/page.tsx** - Dashboard with stats
- **src/app/seller/products/page.tsx** - Product management table
- **src/app/seller/products/new/page.tsx** - Add product form
- **src/app/seller/orders/page.tsx** - Incoming orders
- **src/app/seller/setup/page.tsx** - Onboarding wizard

### Admin Pages (50-100 lines each)
- **src/app/admin/dashboard/page.tsx** - System overview
- **src/app/admin/users/page.tsx** - User management

### Utility Pages (50-150 lines each)
- **src/app/help/page.tsx** - FAQ page
- **src/app/about/page.tsx** - About company

### Components (100+ lines total)
- **src/components/Header.tsx** - Navigation (responsive, logo, links)
- **src/components/Footer.tsx** - Footer (links, social media)

### Libraries & Utilities
- **src/lib/utils.ts** - 11 helper functions (formatting, validation, etc)
- **src/lib/hooks.ts** - 5 custom hooks (user, cart, form, fetch, localStorage)
- **src/lib/db.ts** - Prisma client setup

### Database
- **prisma/schema.prisma** - 18+ Prisma models with relationships
- **scripts/seed.js** - Seeding script with dummy data

### Configuration
- **package.json** - 20+ dependencies specified
- **tsconfig.json** - TypeScript strict mode + path aliases
- **tailwind.config.ts** - Brown theme colors + custom utilities
- **next.config.js** - React strict mode
- **postcss.config.js** - Tailwind + Autoprefixer
- **.eslintrc.json** - ESLint configuration

### Documentation
- **README.md** - ~450 lines (overview, features, tech stack, workflow)
- **QUICKSTART.md** - ~300 lines (installation, testing, navigation)
- **docs/API.md** - ~400 lines (10+ endpoints documented)
- **docs/DATABASE.md** - ~500 lines (19 models with relationships)
- **docs/USER_GUIDE.md** - ~400 lines (role-based guides, tips)
- **docs/DEPLOYMENT.md** - ~400 lines (deployment options, setup)
- **docs/INTEGRATION.md** - ~300 lines (payment, email, uploads, analytics)
- **CONTRIBUTING.md** - Contribution guidelines

## 📈 Project Statistics

| Category | Count |
|----------|-------|
| React Pages | 20+ |
| Components | 2 |
| Custom Hooks | 5 |
| Utility Functions | 11 |
| Prisma Models | 18+ |
| API Endpoints (planned) | 15+ |
| Documentation Files | 9 |
| Configuration Files | 10+ |
| **Total Lines of Code** | **2000+** |
| **Total Documentation** | **2500+** |

## 🔄 Data Flow

### Buyer Journey
```
Home → Browse Products → Product Detail → Add to Cart → 
Cart → Checkout (3 steps) → Order Confirmation → Order History
```

### Seller Journey
```
Register → Setup Store (3 steps) → Dashboard → 
Add Products → Manage Products → View Orders
```

### Admin Journey
```
Login → Dashboard → User Management / Monitor System
```

## 🛠️ Technology Stack Mapping

| Purpose | Technology | Files |
|---------|-----------|-------|
| Frontend Framework | React + Next.js 14 | src/app/** |
| Styling | Tailwind CSS | src/app/globals.css, tailwind.config.ts |
| Language | TypeScript | All .ts/.tsx files |
| Database | Prisma + PostgreSQL | prisma/schema.prisma |
| Icons | React Icons | Components, Pages |
| State Management | React Hooks + localStorage | src/lib/hooks.ts |
| Authentication | NextAuth.js (configured) | .env.local |
| API | Next.js Route Handlers | src/app/api/* |
| Forms | React HTML Forms | Various pages |
| Routing | Next.js App Router | src/app structure |

## 📝 Key Development Patterns

### Page Structure Pattern
```typescript
// src/app/[feature]/page.tsx
'use client';  // Client component
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components';

export default function FeaturePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch from localStorage or API
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto">
        {/* Content */}
      </main>
      <Footer />
    </>
  );
}
```

### Component Pattern
```typescript
// src/components/Component.tsx
import { FC } from 'react';

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

const Component: FC<ComponentProps> = ({ title, onClick }) => {
  return <div onClick={onClick}>{title}</div>;
};

export default Component;
```

### Hook Pattern
```typescript
// src/lib/hooks.ts
export function useFeature() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Setup logic
  }, []);

  return { state, setState };
}
```

---

**File Structure Documentation**
Last Updated: 2024
Project: Pasar Kita MVP Marketplace
