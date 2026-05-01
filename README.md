# Pasar Kita - Marketplace Indonesia

Pasar Kita adalah aplikasi marketplace online terpercaya untuk belanja dan berjualan produk lokal Indonesia dengan mudah, aman, dan terjangkau.

## 🎨 Design & Brand

- **Warna Utama**: Coklat terang (#C8865C), Beige, Cream, Caramel
- **Style**: Modern, bersih, responsif, mobile-first
- **Theme**: Nuansa lokal Indonesia, hangat, terpercaya, sederhana
- **Logo**: Pasar Kita (teks bermerek)

## 🚀 Fitur Utama

### 1. **Autentikasi Pengguna**
- Registrasi & Login
- Role: Pembeli, Penjual, Admin
- Session management

### 2. **Halaman Pembeli**
- Beranda marketplace dengan banner promo
- Katalog produk dengan filter & pencarian
- Detail produk dengan review
- Keranjang belanja & checkout
- Manajemen pesanan & tracking
- Wishlist & review produk
- Chat dengan penjual

### 3. **Halaman Penjual**
- Dashboard toko dengan analytics
- CRUD produk dengan upload gambar
- Manajemen stok & variasi produk
- Kelola pesanan masuk
- Laporan penjualan & statistik
- Manajemen voucher

### 4. **Halaman Admin**
- Dashboard dengan monitoring sistem
- Kelola user & seller
- Kelola produk & kategori
- Manajemen transaksi & pembayaran
- Manajemen banner & promo
- Laporan sistem

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand/React Context
- **Icons**: React Icons
- **UI Components**: Custom components

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js

### Tools & Libraries
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Image Optimization**: Next.js Image
- **HTTP Client**: Axios

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd pasar-kita

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Lalu isi password PostgreSQL di DATABASE_URL

# 4. Buat database PostgreSQL bernama pasar_kita
# Lihat docs/POSTGRESQL.md untuk pgAdmin

# 5. Setup tabel dan seed dummy data
npm run db:setup

# 6. Run development server
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Home page
│   ├── auth/                   # Auth pages (login, register)
│   ├── browse/                 # Product listing
│   ├── product/[id]/           # Product detail
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Checkout process
│   ├── orders/                 # Buyer orders
│   ├── seller/                 # Seller pages
│   │   ├── dashboard/
│   │   ├── products/
│   │   └── orders/
│   └── admin/                  # Admin pages
│       ├── dashboard/
│       ├── users/
│       └── ...
├── components/                 # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                        # Utilities & helpers
│   ├── prisma.ts              # Prisma client
│   ├── auth.ts                # Auth utilities
│   └── ...
└── types/                      # TypeScript types

prisma/
├── schema.prisma              # Database schema
└── migrations/                # Database migrations

public/                        # Static assets
└── ...
```

## 📊 Database Schema

Database mencakup tabel-tabel berikut:
- **users** - Pengguna (buyer, seller, admin)
- **stores** - Toko penjual
- **products** - Produk
- **categories** - Kategori produk
- **cart** & **cart_items** - Keranjang belanja
- **orders** & **order_items** - Pesanan
- **payments** - Pembayaran
- **shipments** - Pengiriman
- **reviews** - Ulasan produk
- **vouchers** - Voucher toko
- **conversations** & **messages** - Chat
- **banners** - Banner promo
- **store_analytics** - Analytics toko

## 🔄 Workflow Bisnis

1. **Penjual** membuat toko dan upload produk
2. **Pembeli** mencari dan melihat produk detail
3. **Pembeli** menambahkan ke keranjang dan checkout
4. **Sistem** membuat pesanan dan memproses pembayaran
5. **Dana** ditahan sementara oleh sistem
6. **Penjual** memproses dan mengirim barang
7. **Pembeli** menerima dan konfirmasi penerimaan
8. **Dana** diteruskan ke penjual
9. **Pembeli** memberikan review & rating

## 🎯 MVP Features

- ✅ Autentikasi user dasar
- ✅ Browse & search produk
- ✅ Product detail & review
- ✅ Shopping cart
- ✅ Checkout & order creation
- ✅ Seller dashboard
- ✅ Admin dashboard
- ✅ Payment simulation
- ✅ Status notifications
- ✅ Dashboard analytics

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 Dummy Data

Aplikasi sudah dilengkapi dengan dummy data produk lokal Indonesia:
- ☕ Makanan & Minuman (Kopi, Gula Merah, Tahu, Madu)
- 👕 Fashion (Batik, Sarung, Tas Kulit)
- 💻 Elektronik (Laptop, Mixer, Robot Vacuum)
- 🏺 Kerajinan (Keramik, Tenun, Tenunan)
- 🛒 Alat Rumah Tangga

## 📱 Responsive Design

Aplikasi fully responsive dengan breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔐 Security Features

- Password hashing dengan bcryptjs
- Session management
- Input validation
- CSRF protection (Next.js built-in)
- Role-based access control

## 🚀 Deployment

### Vercel (Recommended)
```bash
npx vercel deploy
```

### Docker
```bash
docker build -t pasar-kita .
docker run -p 3000:3000 pasar-kita
```

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [PostgreSQL Setup](docs/POSTGRESQL.md)
- [User Guide](docs/USER_GUIDE.md)

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat pull request.

## 📄 License

MIT License - lihat LICENSE file untuk detail

## 👥 Team

Pasar Kita Development Team

## 📧 Support

Untuk support, hubungi: support@pasarkita.local

---

**Pasar Kita** - Marketplace Lokal Indonesia untuk Semua! 🏪
