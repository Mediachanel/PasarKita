# CasaOS Deployment

## Deploy dari CasaOS via GitHub

Jalankan command ini langsung di terminal CasaOS/DietPi sebagai root. Pastikan perubahan terbaru sudah dipush ke GitHub branch `main`.

```bash
mkdir -p /DATA/AppData/pasarkita
cd /DATA/AppData/pasarkita
curl -fsSL https://raw.githubusercontent.com/Mediachanel/PasarKita/main/scripts/deploy-casaos-github.sh -o deploy-casaos-github.sh
sh deploy-casaos-github.sh --install-deps --seed
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
sh deploy-casaos-github.sh

# Pakai db push, bukan prisma migrate deploy
sh deploy-casaos-github.sh --migrate push

# Tulis ulang env dan set URL aplikasi
sh deploy-casaos-github.sh --force-env --nextauth-url http://172.31.254.202:3001

# Pakai repo atau branch lain
sh deploy-casaos-github.sh --repo-url https://github.com/Mediachanel/PasarKita.git --branch main
```

Default app folder: `/DATA/AppData/pasarkita`.

## PostgreSQL

The app expects PostgreSQL to run as container `pasarkita-postgres`.

Create a shared Docker network and attach the existing PostgreSQL container:

```bash
docker network create pasarkita-network
docker network connect pasarkita-network pasarkita-postgres
```

## App Environment

Skrip membuat file env di `/DATA/AppData/pasarkita/.env.casaos` dan menyalinnya ke folder source saat deploy:

```env
DATABASE_URL=postgresql://pasarkita:Tianh%4027@pasarkita-postgres:5432/pasarkita?schema=public
NEXTAUTH_SECRET=change-this-long-random-secret
NEXTAUTH_URL=http://172.31.254.202:3001
NODE_ENV=production
```

`Tianh%4027` is the URL-encoded version of `Tianh@27`.

## Manual Run

```bash
cd /DATA/AppData/pasarkita/source
docker compose -f docker-compose.casaos.yml up -d --build
docker exec -it pasarkita-app npx prisma db push
docker exec -it pasarkita-app npm run db:seed
```

Open:

```text
http://172.31.254.202:3001
```
