# Database Schema - Pasar Kita

## Overview

Database Pasar Kita menggunakan PostgreSQL dengan Prisma ORM.

## Models & Tables

### 1. **User**
Menyimpan informasi pengguna (Buyer, Seller, Admin)

```prisma
- id (String, Primary Key)
- email (String, Unique)
- password (String)
- name (String)
- phone (String, Optional)
- avatar (String, Optional)
- role (Enum: BUYER, SELLER, ADMIN)
- createdAt (DateTime)
- updatedAt (DateTime)

Relations:
- store (One-to-One)
- addresses (One-to-Many)
- cart (One-to-One)
- orders (One-to-Many)
- reviews (One-to-Many)
- conversations (One-to-Many)
```

### 2. **Store**
Informasi toko penjual

```prisma
- id (String, Primary Key)
- name (String, Unique)
- slug (String, Unique)
- description (String, Optional)
- logo (String, Optional)
- banner (String, Optional)
- rating (Float, Default: 0)
- totalReviews (Int, Default: 0)
- createdAt (DateTime)
- updatedAt (DateTime)
- userId (String, Foreign Key)

Relations:
- user (One-to-One)
- products (One-to-Many)
- vouchers (One-to-Many)
- analytics (One-to-One)
```

### 3. **Category**
Kategori produk

```prisma
- id (String, Primary Key)
- name (String, Unique)
- slug (String, Unique)
- icon (String, Optional)
- createdAt (DateTime)

Relations:
- products (One-to-Many)
```

### 4. **Product**
Produk yang dijual

```prisma
- id (String, Primary Key)
- name (String)
- slug (String)
- description (String, Optional)
- price (Float)
- stock (Int)
- sold (Int, Default: 0)
- rating (Float, Default: 0)
- totalReviews (Int, Default: 0)
- createdAt (DateTime)
- updatedAt (DateTime)
- storeId (String, Foreign Key)
- categoryId (String, Foreign Key)

Relations:
- store (Many-to-One)
- category (Many-to-One)
- images (One-to-Many)
- variants (One-to-Many)
- cartItems (One-to-Many)
- orderItems (One-to-Many)
- reviews (One-to-Many)
```

### 5. **ProductImage**
Gambar produk

```prisma
- id (String, Primary Key)
- url (String)
- order (Int, Default: 0)
- createdAt (DateTime)
- productId (String, Foreign Key)

Relations:
- product (Many-to-One)
```

### 6. **ProductVariant**
Variasi produk (size, color, etc)

```prisma
- id (String, Primary Key)
- name (String)
- value (String)
- productId (String, Foreign Key)

Relations:
- product (Many-to-One)
```

### 7. **Cart**
Keranjang belanja pembeli

```prisma
- id (String, Primary Key)
- createdAt (DateTime)
- updatedAt (DateTime)
- userId (String, Foreign Key, Unique)

Relations:
- user (One-to-One)
- items (One-to-Many)
```

### 8. **CartItem**
Item dalam keranjang

```prisma
- id (String, Primary Key)
- quantity (Int, Default: 1)
- cartId (String, Foreign Key)
- productId (String, Foreign Key)

Relations:
- cart (Many-to-One)
- product (Many-to-One)

Constraint:
- Unique: (cartId, productId)
```

### 9. **Order**
Pesanan pembeli

```prisma
- id (String, Primary Key)
- orderNumber (String, Unique)
- status (Enum: PENDING_PAYMENT, PAYMENT_CONFIRMED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED, REFUNDED)
- paymentStatus (Enum: PENDING, COMPLETED, FAILED, REFUNDED)
- shippingStatus (Enum: NOT_SHIPPED, SHIPPED, IN_TRANSIT, DELIVERED, CANCELLED)
- totalAmount (Float)
- shippingCost (Float, Default: 0)
- discountAmount (Float, Default: 0)
- finalAmount (Float)
- notes (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)
- userId (String, Foreign Key)
- addressId (String, Foreign Key, Optional)

Relations:
- user (Many-to-One)
- items (One-to-Many)
- payment (One-to-One)
- shipment (One-to-One)
- address (Many-to-One)
```

### 10. **OrderItem**
Item dalam pesanan

```prisma
- id (String, Primary Key)
- quantity (Int)
- price (Float)
- orderId (String, Foreign Key)
- productId (String, Foreign Key)

Relations:
- order (Many-to-One)
- product (Many-to-One)
```

### 11. **Payment**
Informasi pembayaran

```prisma
- id (String, Primary Key)
- method (Enum: TRANSFER, CARD, EWALLET, COD)
- status (Enum: PENDING, COMPLETED, FAILED, REFUNDED)
- amount (Float)
- transactionId (String, Optional)
- proofUrl (String, Optional)
- paidAt (DateTime, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)
- orderId (String, Foreign Key, Unique)

Relations:
- order (One-to-One)
```

### 12. **Shipment**
Informasi pengiriman

```prisma
- id (String, Primary Key)
- trackingNumber (String, Optional)
- carrier (String, Optional)
- status (Enum: NOT_SHIPPED, SHIPPED, IN_TRANSIT, DELIVERED, CANCELLED)
- estimatedDays (Int, Optional)
- shippedAt (DateTime, Optional)
- deliveredAt (DateTime, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)
- orderId (String, Foreign Key, Unique)

Relations:
- order (One-to-One)
```

### 13. **Address**
Alamat pengiriman pembeli

```prisma
- id (String, Primary Key)
- name (String)
- phone (String)
- street (String)
- city (String)
- province (String)
- postalCode (String)
- isDefault (Boolean, Default: false)
- createdAt (DateTime)
- userId (String, Foreign Key)

Relations:
- user (Many-to-One)
- orders (One-to-Many)
```

### 14. **Review**
Review produk dari pembeli

```prisma
- id (String, Primary Key)
- rating (Int)
- comment (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)
- userId (String, Foreign Key)
- productId (String, Foreign Key)

Relations:
- user (Many-to-One)
- product (Many-to-One)

Constraint:
- Unique: (userId, productId)
```

### 15. **Voucher**
Voucher diskon toko

```prisma
- id (String, Primary Key)
- code (String, Unique)
- description (String, Optional)
- discountType (Enum: PERCENTAGE, FIXED)
- discountValue (Float)
- maxDiscount (Float, Optional)
- minPurchase (Float, Optional)
- maxUsage (Int, Optional)
- usedCount (Int, Default: 0)
- validFrom (DateTime)
- validUntil (DateTime)
- active (Boolean, Default: true)
- createdAt (DateTime)
- storeId (String, Foreign Key)

Relations:
- store (Many-to-One)
```

### 16. **Conversation**
Percakapan antara pembeli dan penjual

```prisma
- id (String, Primary Key)
- createdAt (DateTime)
- updatedAt (DateTime)
- userId (String, Foreign Key)

Relations:
- user (Many-to-One)
- messages (One-to-Many)
```

### 17. **Message**
Pesan dalam percakapan

```prisma
- id (String, Primary Key)
- content (String)
- senderRole (Enum: BUYER, SELLER, ADMIN)
- createdAt (DateTime)
- conversationId (String, Foreign Key)

Relations:
- conversation (Many-to-One)
```

### 18. **Banner**
Banner promo di halaman utama

```prisma
- id (String, Primary Key)
- title (String)
- image (String)
- link (String, Optional)
- order (Int, Default: 0)
- active (Boolean, Default: true)
- createdAt (DateTime)
```

### 19. **StoreAnalytics**
Analytics statistik toko

```prisma
- id (String, Primary Key)
- totalSales (Float, Default: 0)
- totalOrders (Int, Default: 0)
- totalCustomers (Int, Default: 0)
- averageRating (Float, Default: 0)
- updatedAt (DateTime)
- storeId (String, Foreign Key, Unique)

Relations:
- store (One-to-One)
```

## Enums

### UserRole
```
BUYER, SELLER, ADMIN
```

### OrderStatus
```
PENDING_PAYMENT, PAYMENT_CONFIRMED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED, REFUNDED
```

### PaymentStatus
```
PENDING, COMPLETED, FAILED, REFUNDED
```

### ShippingStatus
```
NOT_SHIPPED, SHIPPED, IN_TRANSIT, DELIVERED, CANCELLED
```

### PaymentMethod
```
TRANSFER, CARD, EWALLET, COD
```

### DiscountType
```
PERCENTAGE, FIXED
```

## Indexes

Untuk performa query yang optimal:

- User: (email), (role)
- Product: (storeId), (categoryId), (slug), (storeId, slug)
- Order: (userId), (status), (orderNumber)
- Review: (userId), (productId)
- Voucher: (storeId), (code)
- Conversation: (userId)
- Message: (conversationId)
- Banner: (active)

## Relationships Summary

```
User (1) ---> (1) Store
User (1) ---> (*) Address
User (1) ---> (1) Cart
User (1) ---> (*) Order
User (1) ---> (*) Review
User (1) ---> (*) Conversation

Store (1) ---> (*) Product
Store (1) ---> (*) Voucher
Store (1) ---> (1) StoreAnalytics

Category (1) ---> (*) Product

Product (1) ---> (*) ProductImage
Product (1) ---> (*) ProductVariant
Product (1) ---> (*) CartItem
Product (1) ---> (*) OrderItem
Product (1) ---> (*) Review

Cart (1) ---> (*) CartItem
CartItem (many) ---> Product

Order (1) ---> (*) OrderItem
Order (1) ---> (1) Payment
Order (1) ---> (1) Shipment
Order (1) ---> (1) Address

Conversation (1) ---> (*) Message
```

## Migration & Setup

```bash
# Generate Prisma client
npx prisma generate

# Create tables and run migrations
npm run db:migrate

# Seed database with dummy data
npm run db:seed

# Open Prisma Studio to view/edit data
npm run db:studio
```

---

**Database Documentation - Pasar Kita Marketplace**
