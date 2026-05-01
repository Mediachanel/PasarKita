# Integration Guide - Pasar Kita

## 🔗 Third-Party Services Integration

### Payment Gateway Integration

#### Midtrans (Recommended for Indonesia)

**Installation:**
```bash
npm install midtrans-client
```

**Setup:**
```typescript
// lib/midtrans.ts
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default snap;
```

**Create Payment:**
```typescript
// app/api/payments/create/route.ts
const transaction = await snap.createTransaction({
  transaction_details: {
    order_id: orderId,
    gross_amount: totalAmount,
  },
  customer_details: {
    first_name: customerName,
    email: customerEmail,
    phone: customerPhone,
  },
  item_details: items.map(item => ({
    id: item.productId,
    price: item.price,
    quantity: item.quantity,
    name: item.name,
  })),
});

return transaction.token;
```

### Email Service Integration

#### SendGrid

**Installation:**
```bash
npm install @sendgrid/mail
```

**Setup:**
```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOrderConfirmation(to: string, orderId: string) {
  await sgMail.send({
    to,
    from: 'noreply@pasarkita.com',
    subject: `Pesanan ${orderId} Berhasil Dibuat`,
    html: `<h1>Terima Kasih!</h1><p>Pesanan Anda telah diterima.</p>`,
  });
}
```

### File Upload Integration

#### AWS S3

**Installation:**
```bash
npm install aws-sdk
```

**Setup:**
```typescript
// lib/s3.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function uploadFile(file: Buffer, filename: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `uploads/${Date.now()}-${filename}`,
    Body: file,
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}
```

### SMS Service Integration

#### Twilio

**Installation:**
```bash
npm install twilio
```

**Setup:**
```typescript
// lib/sms.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendShippingUpdate(phone: string, trackingNumber: string) {
  await client.messages.create({
    body: `Paket Anda telah dikirim. Nomor tracking: ${trackingNumber}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}
```

### Analytics Integration

#### Google Analytics

**Setup in layout.tsx:**
```typescript
import Script from 'next/script';

export default function RootLayout() {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </head>
      <body>{/* content */}</body>
    </html>
  );
}
```

### Error Tracking Integration

#### Sentry

**Installation:**
```bash
npm install @sentry/nextjs
```

**Setup in next.config.js:**
```typescript
import { withSentryConfig } from '@sentry/nextjs';

const config = {
  // next config
};

export default withSentryConfig(config, {
  org: 'your-org',
  project: 'pasar-kita',
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### Database Integration

#### PostgreSQL (Production)

**Setup:**
```bash
# .env.production
DATABASE_URL="postgresql://user:password@host:5432/pasar_kita"
```

**Migrate:**
```bash
npx prisma migrate deploy
```

### CDN Integration

#### Cloudflare

1. Go to cloudflare.com
2. Add your domain
3. Update nameservers
4. Enable caching for static assets
5. Configure security settings

### Environment Variables Needed

```bash
# Payment
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=

# Email
SENDGRID_API_KEY=

# File Upload
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Analytics
NEXT_PUBLIC_GA_ID=

# Error Tracking
SENTRY_AUTH_TOKEN=

# CDN
NEXT_PUBLIC_CDN_URL=
```

## 📊 Testing Integration

### API Testing with Postman

1. Create collection for Pasar Kita
2. Add environment with `base_url`
3. Create requests for each endpoint
4. Test authentication flow
5. Save collection for team

### Load Testing

```bash
npm install -g artillery

# Create load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Browse Products'
    flow:
      - get:
          url: '/api/products'

# Run test
artillery run load-test.yml
```

---

**Last Updated:** 2024
**Version:** 1.0
