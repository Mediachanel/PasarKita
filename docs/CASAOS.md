# CasaOS Deployment

## PostgreSQL

The app expects PostgreSQL to run as container `pasarkita-postgres`.

Create a shared Docker network and attach the existing PostgreSQL container:

```bash
docker network create pasarkita-network
docker network connect pasarkita-network pasarkita-postgres
```

## App Environment

Create `.env.casaos` beside `docker-compose.casaos.yml`:

```env
DATABASE_URL="postgresql://pasarkita:Tianh%4027@pasarkita-postgres:5432/pasarkita?schema=public"
NEXTAUTH_SECRET="change-this-long-random-secret"
NEXTAUTH_URL="http://172.31.254.202:3001"
NODE_ENV="production"
```

`Tianh%4027` is the URL-encoded version of `Tianh@27`.

## Run

```bash
docker compose -f docker-compose.casaos.yml up -d --build
docker exec -it pasarkita-app npx prisma db push
docker exec -it pasarkita-app npm run db:seed
```

Open:

```text
http://172.31.254.202:3001
```
