# Deployment Guide - Pasar Kita

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Fix linting issues: `npm run lint:fix`
- [ ] Test all pages load correctly
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Configuration
- [ ] Review `.env` variables
- [ ] Set `NODE_ENV=production`
- [ ] Update database URL for production
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Configure allowed origins/CORS

### Security
- [ ] Remove console logs from production code
- [ ] Remove debug code
- [ ] Sanitize user inputs
- [ ] Review API endpoints for exposed data
- [ ] Enable HTTPS only
- [ ] Setup rate limiting

### Performance
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Enable caching headers
- [ ] Setup CDN for static assets
- [ ] Test page load speed
- [ ] Setup monitoring

### Database
- [ ] Backup development database
- [ ] Create production database
- [ ] Run migrations on production
- [ ] Seed initial data if needed
- [ ] Setup database backups

## 🚀 Deployment Options

### 1. Vercel (Recommended for Next.js)

**Advantages:**
- Zero-config deployment
- Automatic updates on git push
- Built-in CI/CD
- Edge functions
- Global CDN

**Steps:**

1. **Prepare Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <github-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import GitHub repository
- Configure build settings
- Set environment variables
- Click "Deploy"

3. **Post-Deployment**
```bash
# Vercel will automatically run:
# - npm install
# - npm run build
# - npm start
```

### 2. Self-Hosted (AWS EC2, DigitalOcean, etc)

**Steps:**

1. **Setup Server**
```bash
# SSH into server
ssh user@server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx
```

2. **Deploy Application**
```bash
# Clone repository
git clone <repo-url>
cd pasar-kita

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "pasar-kita" -- start
pm2 save
```

3. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/pasar-kita
server {
    listen 80;
    server_name pasarkita.com www.pasarkita.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable SSL with Let's Encrypt**
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pasarkita.com
```

### 3. Docker Deployment

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and Run:**
```bash
docker build -t pasar-kita .
docker run -p 3000:3000 -e DATABASE_URL="..." pasar-kita
```

## 📊 Environment Variables for Production

```bash
# .env.production
NODE_ENV=production

# Database (Use PostgreSQL for production)
DATABASE_URL="postgresql://user:password@host:5432/pasar_kita"

# Authentication
NEXTAUTH_SECRET="<generate-secure-secret>"
NEXTAUTH_URL="https://pasarkita.com"

# API Configuration
NEXT_PUBLIC_API_URL="https://pasarkita.com/api"

# Payment Gateway (when integrated)
# PAYMENT_API_KEY="..."
# PAYMENT_SECRET="..."

# Email Service (for notifications)
# SMTP_HOST="..."
# SMTP_PORT=587
# SMTP_USER="..."
# SMTP_PASSWORD="..."

# File Upload
# AWS_ACCESS_KEY_ID="..."
# AWS_SECRET_ACCESS_KEY="..."
# AWS_S3_BUCKET="..."
```

## 🔒 Security Configuration

### 1. HTTPS/SSL
- Enforce HTTPS redirect
- Set HSTS header
- Setup certificate renewal

### 2. Headers
```nginx
# Add security headers
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 3. Environment
- Never commit `.env` files
- Use secrets management
- Rotate sensitive keys regularly

### 4. Database
- Enable backups
- Use strong passwords
- Restrict access to database
- Enable encryption at rest

## 📈 Monitoring & Maintenance

### 1. Application Monitoring
- Setup error tracking (Sentry, LogRocket)
- Monitor performance (New Relic, DataDog)
- Setup alerts for errors

### 2. Uptime Monitoring
- Monitor server uptime
- Setup ping checks
- Configure notifications

### 3. Database Monitoring
- Monitor query performance
- Watch for slow queries
- Monitor storage usage

### 4. Logs
- Centralize logs (ELK, Sumo Logic)
- Monitor error logs
- Setup alerts

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - name: Deploy
        run: npm run deploy
```

## 🆘 Troubleshooting

### High CPU Usage
- Check for infinite loops
- Monitor database queries
- Optimize code

### Out of Memory
- Increase server RAM
- Check for memory leaks
- Optimize image handling

### Slow Page Load
- Enable caching
- Optimize assets
- Use CDN
- Optimize database queries

### Database Connection Issues
- Check connection string
- Verify credentials
- Check firewall rules
- Monitor connection pool

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Docker Docs**: https://docs.docker.com

## 🎉 Post-Launch

1. **Monitor closely** for first 24-48 hours
2. **Gather user feedback**
3. **Track metrics** (page load, errors, conversions)
4. **Plan updates** and improvements
5. **Schedule maintenance windows**

---

**Deployment Documentation - Pasar Kita**
