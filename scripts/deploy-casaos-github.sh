#!/usr/bin/env sh
set -eu

REPO_URL="${REPO_URL:-https://github.com/Mediachanel/PasarKita.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-/DATA/AppData/pasarkita}"
SOURCE_DIR="${SOURCE_DIR:-$APP_DIR/source}"
DATABASE_URL="${DATABASE_URL:-postgresql://pasarkita:Tianh%4027@pasarkita-postgres:5432/pasarkita?schema=public}"
NEXTAUTH_URL="${NEXTAUTH_URL:-}"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-}"
NETWORK_NAME="${NETWORK_NAME:-pasarkita-network}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-pasarkita-postgres}"
MIGRATE="${MIGRATE:-deploy}"
SEED="${SEED:-0}"
FORCE_ENV="${FORCE_ENV:-0}"
INSTALL_DEPS="${INSTALL_DEPS:-0}"

log() {
  printf '%s\n' "$*"
}

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'USAGE'
Deploy Pasar Kita dari GitHub langsung di CasaOS/DietPi.

Usage:
  sh scripts/deploy-casaos-github.sh [options]

Options:
  --repo-url URL              GitHub repo URL
  --branch NAME               Branch yang akan dideploy
  --app-dir PATH              Folder data app di CasaOS
  --database-url URL          PostgreSQL DATABASE_URL
  --nextauth-url URL          NEXTAUTH_URL publik
  --nextauth-secret VALUE     NEXTAUTH_SECRET
  --network-name NAME         Docker network
  --postgres-container NAME   Nama container PostgreSQL
  --migrate deploy|push|none  Mode migrasi Prisma
  --seed                      Jalankan seed data setelah migrate
  --force-env                 Tulis ulang .env.casaos
  --install-deps              Install git/ca-certificates via apt jika belum ada
  -h, --help                  Tampilkan bantuan

Contoh:
  sh scripts/deploy-casaos-github.sh --seed
USAGE
}

need_value() {
  [ $# -ge 2 ] || die "Argumen $1 butuh nilai."
}

while [ $# -gt 0 ]; do
  case "$1" in
    --repo-url)
      need_value "$@"
      REPO_URL="$2"
      shift 2
      ;;
    --branch)
      need_value "$@"
      BRANCH="$2"
      shift 2
      ;;
    --app-dir)
      need_value "$@"
      APP_DIR="$2"
      SOURCE_DIR="$APP_DIR/source"
      shift 2
      ;;
    --database-url)
      need_value "$@"
      DATABASE_URL="$2"
      shift 2
      ;;
    --nextauth-url)
      need_value "$@"
      NEXTAUTH_URL="$2"
      shift 2
      ;;
    --nextauth-secret)
      need_value "$@"
      NEXTAUTH_SECRET="$2"
      shift 2
      ;;
    --network-name)
      need_value "$@"
      NETWORK_NAME="$2"
      shift 2
      ;;
    --postgres-container)
      need_value "$@"
      POSTGRES_CONTAINER="$2"
      shift 2
      ;;
    --migrate)
      need_value "$@"
      MIGRATE="$2"
      shift 2
      ;;
    --seed)
      SEED="1"
      shift
      ;;
    --force-env)
      FORCE_ENV="1"
      shift
      ;;
    --install-deps)
      INSTALL_DEPS="1"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "Argumen tidak dikenal: $1"
      ;;
  esac
done

case "$MIGRATE" in
  deploy|push|none) ;;
  *) die "--migrate harus deploy, push, atau none." ;;
esac

install_deps() {
  [ "$INSTALL_DEPS" = "1" ] || return 0
  command -v apt-get >/dev/null 2>&1 || die "apt-get tidak tersedia untuk --install-deps."

  missing=""
  command -v git >/dev/null 2>&1 || missing="$missing git"
  [ -d /etc/ssl/certs ] || missing="$missing ca-certificates"

  if [ -n "$missing" ]; then
    log "Menginstall dependency:$missing"
    apt-get update
    apt-get install -y $missing
  fi
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Command '$1' tidak ditemukan."
}

generate_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -base64 32
    return
  fi

  if [ -r /dev/urandom ]; then
    LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | dd bs=48 count=1 2>/dev/null
    printf '\n'
    return
  fi

  date +%s | sha256sum | awk '{print $1}'
}

docker_compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  else
    die "Docker Compose tidak ditemukan."
  fi
}

detect_nextauth_url() {
  host_ip="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
  if [ -z "$host_ip" ]; then
    host_ip="127.0.0.1"
  fi
  printf 'http://%s:3001\n' "$host_ip"
}

write_env_file() {
  env_file="$APP_DIR/.env.casaos"

  if [ "$FORCE_ENV" != "1" ] && [ -f "$env_file" ]; then
    log "Memakai env yang sudah ada: $env_file"
    return
  fi

  if [ -z "$NEXTAUTH_URL" ]; then
    NEXTAUTH_URL="$(detect_nextauth_url)"
  fi

  if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET="$(generate_secret)"
  fi

  umask 077
  cat > "$env_file" <<ENV
DATABASE_URL=$DATABASE_URL
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=$NEXTAUTH_URL
NODE_ENV=production
ENV

  log "Menulis env: $env_file"
}

sync_source() {
  mkdir -p "$APP_DIR"

  if [ -d "$SOURCE_DIR/.git" ]; then
    log "Update source dari GitHub: $SOURCE_DIR"
    cd "$SOURCE_DIR"
    git remote set-url origin "$REPO_URL"
    git fetch --prune origin

    if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
      git checkout "$BRANCH"
    else
      git checkout -b "$BRANCH" "origin/$BRANCH"
    fi

    git pull --ff-only origin "$BRANCH"
  else
    if [ -e "$SOURCE_DIR" ]; then
      die "$SOURCE_DIR sudah ada tapi bukan repo git."
    fi

    log "Clone source dari GitHub ke $SOURCE_DIR"
    git clone --branch "$BRANCH" "$REPO_URL" "$SOURCE_DIR"
    cd "$SOURCE_DIR"
  fi
}

connect_postgres_network() {
  docker network inspect "$NETWORK_NAME" >/dev/null 2>&1 || docker network create "$NETWORK_NAME" >/dev/null

  if docker ps -a --format '{{.Names}}' | grep -qx "$POSTGRES_CONTAINER"; then
    docker network connect "$NETWORK_NAME" "$POSTGRES_CONTAINER" >/dev/null 2>&1 || true
  else
    log "Peringatan: container PostgreSQL '$POSTGRES_CONTAINER' tidak ditemukan."
  fi
}

run_migration() {
  [ "$MIGRATE" != "none" ] || return 0

  tries=1
  while [ "$tries" -le 12 ]; do
    if [ "$MIGRATE" = "deploy" ]; then
      docker exec pasarkita-app npx prisma migrate deploy && return 0
    else
      docker exec pasarkita-app npx prisma db push && return 0
    fi

    log "Migrasi belum berhasil, coba lagi dalam 5 detik ($tries/12)..."
    tries=$((tries + 1))
    sleep 5
  done

  die "Migrasi Prisma gagal."
}

install_deps
require_command git
require_command docker

sync_source
write_env_file
cp "$APP_DIR/.env.casaos" "$SOURCE_DIR/.env.casaos"

connect_postgres_network

log "Build dan start container..."
cd "$SOURCE_DIR"
docker_compose -f docker-compose.casaos.yml up -d --build

run_migration

if [ "$SEED" = "1" ]; then
  docker exec pasarkita-app npm run db:seed
fi

docker ps --filter "name=pasarkita-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

if [ -z "$NEXTAUTH_URL" ] && [ -f "$APP_DIR/.env.casaos" ]; then
  NEXTAUTH_URL="$(awk -F= '/^NEXTAUTH_URL=/{print $2; exit}' "$APP_DIR/.env.casaos")"
fi

log "Deploy selesai: ${NEXTAUTH_URL:-http://server-ip:3001}"
