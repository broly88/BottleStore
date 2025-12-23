# API Documentation

Base URL: `http://localhost:5000/api`

All endpoints return JSON responses in the following format:

```json
{
  "success": true/false,
  "data": {...},
  "error": "Error message if applicable"
}
```

## Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register
**POST** `/auth/register`

Register a new user account with age verification.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1995-05-15",
  "phone": "+27123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {...},
    "token": "jwt_token"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Verify Email
**POST** `/auth/verify-email`

**Body:**
```json
{
  "token": "email_verification_token"
}
```

### Forgot Password
**POST** `/auth/forgot-password`

**Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

**Body:**
```json
{
  "token": "reset_token",
  "password": "NewPassword123!"
}
```

### Get Current User
**GET** `/auth/me`

Requires authentication.

### Update Profile
**PUT** `/auth/me`

Requires authentication.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+27123456789"
}
```

### Refresh Token
**POST** `/auth/refresh-token`

---

## Products

### Get All Products
**GET** `/products`

**Query Parameters:**
- `category` - Filter by category (wine, beer, spirits, cider)
- `subcategory` - Filter by subcategory
- `brand` - Filter by brand
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minAlcohol` - Minimum alcohol content
- `maxAlcohol` - Maximum alcohol content
- `search` - Search term
- `featured` - true/false
- `isActive` - true/false (default: true)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - ASC/DESC (default: DESC)

**Example:**
```
GET /products?category=wine&minPrice=50&maxPrice=100&page=1&limit=10
```

### Get Product by Slug
**GET** `/products/slug/:slug`

**Example:**
```
GET /products/slug/nederburg-cabernet-sauvignon
```

### Get Product by ID
**GET** `/products/:id`

### Get Featured Products
**GET** `/products/featured`

**Query Parameters:**
- `limit` - Number of products (default: 10)

### Get Categories
**GET** `/products/categories`

### Create Product (Admin Only)
**POST** `/products`

Requires authentication and admin role.

**Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "category": "wine",
  "subcategory": "red_wine",
  "brand": "Brand Name",
  "alcoholContent": 13.5,
  "volumeMl": 750,
  "price": 89.99,
  "stockQuantity": 50,
  "lowStockThreshold": 10,
  "imageUrl": "https://...",
  "featured": false
}
```

### Update Product (Admin Only)
**PUT** `/products/:id`

### Delete Product (Admin Only)
**DELETE** `/products/:id`

---

## Shopping Cart

All cart endpoints require authentication and age verification.

### Get Cart
**GET** `/cart`

### Add to Cart
**POST** `/cart/items`

**Body:**
```json
{
  "productId": "product_uuid",
  "quantity": 2
}
```

### Update Cart Item
**PUT** `/cart/items/:id`

**Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
**DELETE** `/cart/items/:id`

### Clear Cart
**DELETE** `/cart`

---

## Orders

### Create Order
**POST** `/orders`

Requires authentication and age verification.

**Body:**
```json
{
  "items": [
    {
      "productId": "product_uuid",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "streetAddress": "123 Main St",
    "suburb": "Sandton",
    "city": "Johannesburg",
    "province": "Gauteng",
    "postalCode": "2196"
  },
  "deliveryInstructions": "Leave at gate",
  "deliveryDate": "2024-12-25",
  "deliveryFee": 50.00
}
```

### Get User Orders
**GET** `/orders`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status

### Get Order by ID
**GET** `/orders/:id`

### Cancel Order
**PUT** `/orders/:id/cancel`

### Get All Orders (Admin)
**GET** `/orders/admin/all`

**Query Parameters:**
- `page`, `limit`, `status`, `paymentStatus`

### Update Order Status (Admin)
**PUT** `/orders/admin/:id/status`

**Body:**
```json
{
  "status": "processing",
  "notes": "Order dispatched"
}
```

---

## Payment

### Create Payment Intent
**POST** `/payment/create-payment-intent`

Requires authentication and age verification.

**Body:**
```json
{
  "deliveryAddress": {...},
  "deliveryInstructions": "...",
  "deliveryDate": "2024-12-25",
  "deliveryFee": 50.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "stripe_client_secret",
    "orderId": "order_uuid",
    "orderNumber": "ORD-123456",
    "totalAmount": 250.00
  }
}
```

### Stripe Webhook
**POST** `/payment/webhook`

Stripe webhook endpoint for payment events.

### Get Payment Status
**GET** `/payment/order/:orderId/status`

---

## Addresses

All address endpoints require authentication.

### Get User Addresses
**GET** `/addresses`

### Create Address
**POST** `/addresses`

**Body:**
```json
{
  "addressType": "home",
  "streetAddress": "123 Main Street",
  "suburb": "Sandton",
  "city": "Johannesburg",
  "province": "Gauteng",
  "postalCode": "2196",
  "isDefault": true
}
```

**Valid Provinces:**
- Eastern Cape
- Free State
- Gauteng
- KwaZulu-Natal
- Limpopo
- Mpumalanga
- Northern Cape
- North West
- Western Cape

### Update Address
**PUT** `/addresses/:id`

### Delete Address
**DELETE** `/addresses/:id`

### Set Default Address
**PUT** `/addresses/:id/set-default`

---

## Admin

All admin endpoints require authentication and admin role.

### Get Dashboard Stats
**GET** `/admin/dashboard/stats`

Returns:
- User statistics
- Product statistics (total, active, low stock, out of stock)
- Order statistics
- Revenue statistics (total, today, this month)
- Recent orders

### Get Sales Report
**GET** `/admin/reports/sales`

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `groupBy` - day/week/month (default: day)

### Get Inventory Report
**GET** `/admin/reports/inventory`

**Query Parameters:**
- `category` - Filter by category
- `lowStockOnly` - true/false
- `outOfStockOnly` - true/false

### Get All Users
**GET** `/admin/users`

**Query Parameters:**
- `page`, `limit`, `role`, `ageVerified`, `emailVerified`

### Update User Role
**PUT** `/admin/users/:id/role`

**Body:**
```json
{
  "role": "admin"
}
```

---

## Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions or age verification required)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Rate Limiting

All API endpoints are rate limited to 100 requests per 15 minutes per IP address.

---

## South African Compliance

### Age Verification
- Users must be 18+ to register
- Age verification required for cart and checkout operations
- All verifications are logged with IP and timestamp

### VAT
- All prices include 15% VAT
- VAT breakdown provided in order details

### Delivery Restrictions
- No deliveries on Sundays
- No deliveries on public holidays
- Delivery hours: 9 AM - 6 PM Monday-Saturday

### POPIA Compliance
- User data is encrypted
- Clear privacy policy
- Right to access and delete data
