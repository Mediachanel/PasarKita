# PostgreSQL Setup - Pasar Kita

## 1. Register Server di pgAdmin

Di halaman pgAdmin, isi:

- Server Name: `Local PostgreSQL 18`
- Host name/address: `localhost`
- Port: `5432`
- Database/Maintenance database: `postgres`
- User: `postgres`
- Password: password PostgreSQL yang dibuat saat instalasi

Centang `Save password` jika ingin pgAdmin mengingat password.

## 2. Buat Database Aplikasi

Setelah tersambung ke server, buka Query Tool dan jalankan:

```sql
CREATE DATABASE pasar_kita;
```

Jika database sudah ada, lewati langkah ini.

## 3. Update Environment

Edit `.env` dan `.env.local`, ganti password di `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pasar_kita?schema=public"
```

Jika password mengandung karakter khusus seperti `@`, `#`, `:`, atau `/`, encode dulu untuk URL.

## 4. Buat Tabel dan Isi Data Contoh

Jalankan dari folder proyek:

```bash
npx prisma generate
npm run db:migrate
npm run db:seed
```

Atau satu perintah:

```bash
npm run db:setup
```

## 5. Akun Demo

Semua akun demo memakai password `password123`.

- Buyer: `buyer@example.com`
- Seller: `seller@example.com`
- Admin: `admin@example.com`

## 6. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:3000`.

## Reset Data

Untuk menghapus isi database dan menjalankan seed ulang:

```bash
npm run db:reset
```
