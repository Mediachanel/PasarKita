# Quick Start Guide - Pasar Kita

## 🚀 Persiapan Awal

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm/yarn/pnpm
- PostgreSQL 18+ dan pgAdmin 4
- Git (opsional)

### Installation

#### 1. Persiapkan Environment

```bash
# Windows
cd d:\sistem

# macOS/Linux
cd /path/to/pasar-kita
```

#### 2. Install Dependencies

```bash
npm install
# atau
yarn install
pnpm install
```

#### 3. Setup Environment Variables

```bash
# Copy file template
cp .env.example .env.local

# File sudah memiliki konfigurasi development default
```

Edit `.env.local` dan `.env`, lalu ganti password PostgreSQL di:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pasar_kita?schema=public"
```

#### 4. Setup Database

Di pgAdmin, register server lokal dan buat database:

```sql
CREATE DATABASE pasar_kita;
```

Lihat detail field pgAdmin di [docs/POSTGRESQL.md](docs/POSTGRESQL.md).

```bash
# Generate Prisma Client
npx prisma generate

# Create database dan run migrations
npm run db:migrate

# Seed database dengan dummy data
npm run db:seed
```

#### 5. Run Development Server

```bash
npm run dev
# Server berjalan di http://localhost:3000
```

## 📊 Testing Akun

Setelah menjalankan `npm run db:seed`, gunakan akun berikut:

### Pembeli (Buyer)
- **Email**: buyer@example.com
- **Password**: password123

### Penjual (Seller)
- **Email**: seller@example.com
- **Password**: password123

### Admin
- **Email**: admin@example.com
- **Password**: password123

## 🗺️ Navigasi Aplikasi

### Home Page
```
http://localhost:3000/
```
- Hero banner dengan call-to-action
- Features marketplace
- Link untuk mulai belanja atau jadi penjual

### Browse Products
```
http://localhost:3000/browse
```
- Katalog produk lokal Indonesia
- Filter berdasarkan kategori
- Search dan sort
- Dummy data sudah tersedia

### Product Detail
```
http://localhost:3000/product/[id]
```
- Informasi lengkap produk
- Review dan rating
- Data penjual

### Shopping Features
- **Cart**: `http://localhost:3000/cart`
- **Checkout**: `http://localhost:3000/checkout`
- **Orders**: `http://localhost:3000/orders`

### Seller Dashboard
```
http://localhost:3000/seller/dashboard
```
- Statistik toko
- Quick actions
- Recent orders

### Seller Product Management
```
http://localhost:3000/seller/products
```
- Daftar produk penjual
- Tambah produk baru
- Edit/hapus produk

### Seller Orders
```
http://localhost:3000/seller/orders
```
- Pesanan masuk
- Manage status pesanan

### Admin Dashboard
```
http://localhost:3000/admin/dashboard
```
- Statistik sistem
- Monitor transaksi
- System alerts

### Admin User Management
```
http://localhost:3000/admin/users
```
- Daftar semua user
- Manage user data

## 📁 Project Structure

```
pasar-kita/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── auth/               # Auth pages
│   │   ├── browse/             # Product listing
│   │   ├── product/            # Product detail
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout process
│   │   ├── orders/             # Buyer orders
│   │   ├── seller/             # Seller pages
│   │   ├── admin/              # Admin pages
│   │   ├── help/               # Help page
│   │   ├── about/              # About page
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/                    # Utilities & hooks
│       ├── utils.ts
│       └── hooks.ts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # PostgreSQL migrations
├── docs/
│   ├── API.md                  # API documentation
│   ├── USER_GUIDE.md           # User guide
│   └── DATABASE.md             # Database schema docs
├── scripts/
│   └── seed.js                 # Database seeding script
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.local                  # Local environment variables
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Brown**: #C8865C
- **Secondary Beige**: #E8D5C4
- **Cream**: #F9F6F0
- **Caramel**: #D4A574

### Typography
- **Display**: Playfair Display (headers)
- **Body**: Inter (content)

### Components
- Responsive buttons (primary, secondary, outline)
- Card components with hover effects
- Badge components for status
- Form inputs with validation styling

## 🧪 Testing Features

### 1. Product Browsing
- Buka `/browse`
- Filter berdasarkan kategori
- Search produk
- Lihat product detail

### 2. Shopping
- Tambah produk ke cart
- Lihat cart
- Checkout dengan dummy data
- Lihat order success

### 3. Seller Features
- Login as seller
- Buka seller dashboard
- Lihat produk management
- Lihat order masuk

### 4. Admin Features
- Login as admin
- Buka admin dashboard
- Manage users
- Monitor transaksi

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Build & Production
npm run build           # Build untuk production
npm start               # Start production server

# Database
npm run db:migrate      # Run database migrations
npm run db:setup        # Run migrations + seed dummy data
npm run db:reset        # Reset PostgreSQL database
npm run db:seed         # Seed dummy data
npm run db:studio       # Open Prisma Studio GUI

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
```

## 🐛 Troubleshooting

### Database Error
```bash
# Reset database
npx prisma migrate reset
```

### Port Already in Use
```bash
# Jalankan di port berbeda
npm run dev -- -p 3001
```

### Dependencies Issue
```bash
# Clean install
rm -rf node_modules
npm install
```

## 📝 Dummy Data

Database seeding sudah menambahkan:

**Categories**:
- ☕ Makanan & Minuman
- 👕 Fashion
- 💻 Elektronik
- 🏺 Kerajinan
- 🛒 Alat Rumah Tangga

**Products**:
- Kopi Specialty Sumatra
- Gula Merah Organik
- Batik Premium
- Sarung Batik
- Dan lebih banyak...

**Users**:
- 1 Admin account
- 2 Seller accounts dengan toko
- 2 Buyer accounts

## 🚀 Next Steps

1. **Explore the app** - Jelajahi semua halaman
2. **Read documentation** - Baca API.md dan USER_GUIDE.md
3. **Customize branding** - Sesuaikan logo dan warna
4. **Add features** - Implementasi fitur tambahan
5. **Setup production** - Deploy ke Vercel atau hosting lain

## 📞 Support

- **Documentation**: Lihat folder `/docs`
- **Issues**: Check di file troubleshooting
- **Questions**: Refer ke USER_GUIDE.md

## 🎉 Ready!

Aplikasi Pasar Kita Anda sudah siap untuk dikembangkan lebih lanjut!

---

**Selamat menggunakan Pasar Kita!** 🏪
