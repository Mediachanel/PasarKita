# API Documentation - Pasar Kita

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name",
    "role": "BUYER"
  },
  "token": "token-1"
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "BUYER"
}
```

## Products Endpoints

### Get All Products
```http
GET /products?page=1&limit=10&category=makanan-minuman&search=kopi&sort=rating
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category slug
- `search` - Search by product name
- `sort` - Sort by: newest, price-low, price-high, rating

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Kopi Specialty Sumatra",
      "price": 89000,
      "rating": 4.8,
      "totalReviews": 342,
      "image": "/images/kopi-1.jpg",
      "store": {
        "id": "1",
        "name": "Kopi Nusantara"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

### Get Product by ID
```http
GET /products/1
```

### Create Product (Seller)
```http
POST /products
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "New Product",
  "description": "Product description",
  "price": 100000,
  "stock": 50,
  "categoryId": "1",
  "images": ["image-url-1", "image-url-2"]
}
```

### Update Product (Seller)
```http
PUT /products/1
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Updated Product",
  "price": 120000,
  "stock": 40
}
```

### Delete Product (Seller)
```http
DELETE /products/1
Authorization: Bearer {token}
```

## Cart Endpoints

### Get Cart
```http
GET /cart
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart-1",
    "items": [
      {
        "id": "item-1",
        "product": {
          "id": "1",
          "name": "Kopi Specialty",
          "price": 89000
        },
        "quantity": 2
      }
    ],
    "total": 178000
  }
}
```

### Add to Cart
```http
POST /cart/add
Content-Type: application/json
Authorization: Bearer {token}

{
  "productId": "1",
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /cart/items/item-1
Content-Type: application/json
Authorization: Bearer {token}

{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /cart/items/item-1
Authorization: Bearer {token}
```

### Clear Cart
```http
DELETE /cart
Authorization: Bearer {token}
```

## Orders Endpoints

### Get User Orders
```http
GET /orders
Authorization: Bearer {token}
```

### Get Order by ID
```http
GET /orders/order-1
Authorization: Bearer {token}
```

### Create Order (Checkout)
```http
POST /orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "addressId": "address-1",
  "courier": "JNE",
  "paymentMethod": "transfer"
}
```

### Update Order Status (Seller/Admin)
```http
PUT /orders/order-1/status
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "shipped",
  "trackingNumber": "JNE123456789"
}
```

## Payments Endpoints

### Get Payment Details
```http
GET /orders/order-1/payment
Authorization: Bearer {token}
```

### Confirm Payment
```http
POST /orders/order-1/payment/confirm
Content-Type: application/json
Authorization: Bearer {token}

{
  "method": "transfer",
  "proofUrl": "/uploads/proof-123.jpg"
}
```

## Reviews Endpoints

### Get Product Reviews
```http
GET /products/1/reviews?page=1&limit=10
```

### Create Review
```http
POST /products/1/reviews
Content-Type: application/json
Authorization: Bearer {token}

{
  "rating": 5,
  "comment": "Produk sangat bagus!"
}
```

## Categories Endpoints

### Get All Categories
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Makanan & Minuman",
      "slug": "makanan-minuman",
      "icon": "🍽️"
    }
  ]
}
```

## Stores Endpoints

### Get Store by ID
```http
GET /stores/store-1
```

### Get Seller Store
```http
GET /stores/my
Authorization: Bearer {token}
```

### Update Store
```http
PUT /stores/my
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Updated Store Name",
  "description": "Updated description",
  "logo": "/images/logo.jpg"
}
```

## Error Handling

All endpoints return error in this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `INVALID_INPUT` - Invalid request parameters
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

## Rate Limiting

- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## Authentication

All protected endpoints require `Authorization` header:

```
Authorization: Bearer {token}
```

Tokens are valid for 24 hours and can be refreshed.
