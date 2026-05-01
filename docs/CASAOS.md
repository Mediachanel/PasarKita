# CasaOS Deployment

Status deployment terakhir yang tervalidasi:

- Aplikasi berjalan di host port `3002` dan container port `3000`.
- URL lokal aplikasi: `http://172.31.254.202:3002`.
- Domain publik `pasarkita.kepegawaian.media` diarahkan ke service `http://localhost:3002`.
- PostgreSQL memakai container existing `pasarkita-postgres`.
- Prisma dijalankan dengan `db push` untuk setup awal database.

## Deploy dari CasaOS via GitHub

Jalankan command ini langsung di terminal CasaOS/DietPi sebagai root. Pastikan perubahan terbaru sudah dipush ke GitHub branch `main`.

```bash
mkdir -p /DATA/AppData/pasarkita
cd /DATA/AppData/pasarkita
curl -fsSL https://raw.githubusercontent.com/Mediachanel/PasarKita/main/scripts/deploy-casaos-github.sh -o deploy-casaos-github.sh
sh deploy-casaos-github.sh --install-deps --force-env --nextauth-url http://172.31.254.202:3002 --migrate push --seed
```

Jika `curl` belum ada:

```bash
apt-get update
apt-get install -y curl
```

Skrip akan clone/pull dari GitHub ke `/DATA/AppData/pasarkita/source`, membuat `.env.casaos` di `/DATA/AppData/pasarkita`, lalu menjalankan:

```bash
docker compose -f docker-compose.casaos.yml up -d --build
```

Opsi yang sering dipakai:

```bash
# Deploy ulang tanpa seed
cd /DATA/AppData/pasarkita
sh deploy-casaos-github.sh --force-env --nextauth-url http://172.31.254.202:3002 --migrate push

# Pakai db push, bukan prisma migrate deploy
sh deploy-casaos-github.sh --migrate push

# Tulis ulang env dan set URL aplikasi
sh deploy-casaos-github.sh --force-env --nextauth-url http://172.31.254.202:3002

# Pakai repo atau branch lain
sh deploy-casaos-github.sh --repo-url https://github.com/Mediachanel/PasarKita.git --branch main
```

Default app folder: `/DATA/AppData/pasarkita`.

## Validasi Setelah Deploy

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker logs --tail 80 pasarkita-app
```

Pastikan container app menampilkan mapping port:

```text
0.0.0.0:3002->3000/tcp
```

Buka aplikasi:

```text
http://172.31.254.202:3002
```

Root aplikasi harus menampilkan halaman frontend PasarKita. Endpoint API hanya berada di `/api/*`.

## PostgreSQL

The app expects PostgreSQL to run as container `pasarkita-postgres`.

Create a shared Docker network and attach the existing PostgreSQL container:

```bash
docker network create pasarkita-network
docker network connect pasarkita-network pasarkita-postgres
```

Skrip deploy akan mencoba membuat role dan database berikut di container PostgreSQL yang sudah ada:

```text
Database: pasarkita
User: pasarkita
Password: Tianh@27
```

Jika nama container PostgreSQL di CasaOS berbeda, jalankan deploy dengan:

```bash
sh deploy-casaos-github.sh --postgres-container NAMA_CONTAINER_POSTGRES --force-env --nextauth-url http://172.31.254.202:3002
```

Jika container PostgreSQL tidak memiliki role `postgres`, gunakan role admin yang dibuat CasaOS, misalnya:

```bash
sh deploy-casaos-github.sh --postgres-admin-user pasarkita --force-env --nextauth-url http://172.31.254.202:3002
```

Untuk mengecek koneksi database secara manual:

```bash
docker exec -it pasarkita-postgres psql -U pasarkita -d pasarkita -c "SELECT 1;"
```

Jika Anda ingin memakai database atau kredensial lain:

```bash
sh deploy-casaos-github.sh \
  --app-db-name pasarkita \
  --app-db-user pasarkita \
  --app-db-password 'Tianh@27' \
  --database-url 'postgresql://pasarkita:Tianh%4027@pasarkita-postgres:5432/pasarkita?schema=public' \
  --force-env \
  --nextauth-url http://172.31.254.202:3002
```

## App Environment

Skrip membuat file env di `/DATA/AppData/pasarkita/.env.casaos` dan menyalinnya ke folder source saat deploy:

```env
DATABASE_URL=postgresql://pasarkita:Tianh%4027@pasarkita-postgres:5432/pasarkita?schema=public
NEXTAUTH_SECRET=change-this-long-random-secret
NEXTAUTH_URL=http://172.31.254.202:3002
NODE_ENV=production
```

`Tianh%4027` is the URL-encoded version of `Tianh@27`.

> Jika Anda menggunakan Cloudflare Tunnel, `NEXTAUTH_URL` harus memakai domain publik agar redirect NextAuth berjalan benar.

## Cloudflare Tunnel

Untuk Cloudflare Tunnel, pastikan konfigurasi ingress mengarah langsung ke root aplikasi:

```yaml
ingress:
  - hostname: pasarkita.kepegawaian.media
    service: http://localhost:3002
  - service: http_status:404
```

Jangan gunakan `service: http://localhost:3002/api/auth` pada level ingress utama.

## Troubleshooting

### Root menampilkan JSON `unauth`

Pastikan tunnel/domain mengarah ke root aplikasi:

```text
http://localhost:3002
```

Jangan arahkan service utama ke `/api/auth`, `/api/session`, `/api/me`, atau endpoint `/api/*` lain.

### Port `3001` sudah dipakai

Deployment ini memakai `3002`. Jika log masih menyebut `3001`, file env/compose lama masih dipakai. Jalankan deploy dengan `--force-env`:

```bash
cd /DATA/AppData/pasarkita
sh deploy-casaos-github.sh --force-env --nextauth-url http://172.31.254.202:3002 --migrate push
```

### Prisma gagal detect OpenSSL/libssl

Dockerfile sudah menginstall `openssl` dan `libc6-compat`. Jika masih muncul error lama, rebuild tanpa cache:

```bash
cd /DATA/AppData/pasarkita/source
docker compose -f docker-compose.casaos.yml build --no-cache
docker compose -f docker-compose.casaos.yml up -d
```

### Role `postgres` tidak ada

Beberapa container PostgreSQL CasaOS dibuat tanpa role `postgres`. Script deploy akan mencoba user `pasarkita` juga. Jika perlu, jalankan eksplisit:

```bash
cd /DATA/AppData/pasarkita
sh deploy-casaos-github.sh --postgres-admin-user pasarkita --force-env --nextauth-url http://172.31.254.202:3002 --migrate push
```

### Layar terlihat gelap atau tidak bisa diklik

Hard refresh browser setelah deploy:

```text
Ctrl + F5
```

Jika masih terlihat overlay kecil dari browser/extension, coba Incognito atau matikan extension sementara. Overlay filter mobile di `/browse` sudah dibuat otomatis tertutup saat layar desktop.

## Manual Run

```bash
cd /DATA/AppData/pasarkita/source
docker compose -f docker-compose.casaos.yml up -d --build
docker exec -it pasarkita-app npx prisma db push
docker exec -it pasarkita-app npm run db:seed
```

Open:

```text
http://172.31.254.202:3002
```

Jika tunnel Cloudflare dikonfigurasi untuk `pasarkita.kepegawaian.media`, domain publik harus diarahkan ke `http://localhost:3002` dan menampilkan halaman utama Next.js, bukan JSON API.
