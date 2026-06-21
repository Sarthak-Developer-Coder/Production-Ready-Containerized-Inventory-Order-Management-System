# 🔌 API Documentation

## Complete API Reference

All endpoints are documented with examples. Base URL: `http://localhost:8000` (local) or your production URL.

---

## Table of Contents

1. [Health Check](#health-check)
2. [Products](#products)
3. [Customers](#customers)
4. [Orders](#orders)
5. [Dashboard](#dashboard)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Health Check

### Endpoint: GET /health

Check if the API is running.

**Request:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

**Status Code:** `200`

---

## Products

### Create Product

**Endpoint:** `POST /products`

Create a new product.

**Request Body:**
```json
{
  "name": "Laptop",
  "sku": "LAP-001",
  "price": 999.99,
  "quantity_in_stock": 10
}
```

**Requirements:**
- `name`: Required, string (1-255 chars)
- `sku`: Required, unique string (1-50 chars)
- `price`: Required, number > 0
- `quantity_in_stock`: Optional, number >= 0 (default: 0)

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "LAP-001",
  "price": 999.99,
  "quantity_in_stock": 10,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "detail": "Product SKU must be unique"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99,
    "quantity_in_stock": 10
  }'
```

---

### Get All Products

**Endpoint:** `GET /products?skip=0&limit=100`

Retrieve all products with pagination.

**Query Parameters:**
- `skip`: Number of products to skip (default: 0)
- `limit`: Maximum products to return (default: 100, max: 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99,
    "quantity_in_stock": 10,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "name": "Mouse",
    "sku": "MOUSE-001",
    "price": 29.99,
    "quantity_in_stock": 50,
    "created_at": "2024-01-15T10:31:00",
    "updated_at": "2024-01-15T10:31:00"
  }
]
```

**Curl Example:**
```bash
curl http://localhost:8000/products?skip=0&limit=50
```

---

### Get Product by ID

**Endpoint:** `GET /products/{product_id}`

Retrieve a specific product.

**Path Parameters:**
- `product_id`: Product ID (integer)

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "LAP-001",
  "price": 999.99,
  "quantity_in_stock": 10,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Product not found"
}
```

**Curl Example:**
```bash
curl http://localhost:8000/products/1
```

---

### Update Product

**Endpoint:** `PUT /products/{product_id}`

Update product details.

**Path Parameters:**
- `product_id`: Product ID (integer)

**Request Body (all fields optional):**
```json
{
  "name": "Gaming Laptop",
  "price": 1299.99,
  "quantity_in_stock": 5
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Gaming Laptop",
  "sku": "LAP-001",
  "price": 1299.99,
  "quantity_in_stock": 5,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:35:00"
}
```

**Curl Example:**
```bash
curl -X PUT http://localhost:8000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "price": 1299.99
  }'
```

---

### Delete Product

**Endpoint:** `DELETE /products/{product_id}`

Delete a product.

**Path Parameters:**
- `product_id`: Product ID (integer)

**Response:** `204 No Content`

**Error Response (404 Not Found):**
```json
{
  "detail": "Product not found"
}
```

**Curl Example:**
```bash
curl -X DELETE http://localhost:8000/products/1
```

---

## Customers

### Create Customer

**Endpoint:** `POST /customers`

Create a new customer.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890"
}
```

**Requirements:**
- `full_name`: Required, string (1-255 chars)
- `email`: Required, unique email address
- `phone_number`: Required, string (7-20 chars)

**Response (201 Created):**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "created_at": "2024-01-15T10:40:00",
  "updated_at": "2024-01-15T10:40:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "detail": "Customer email must be unique"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890"
  }'
```

---

### Get All Customers

**Endpoint:** `GET /customers?skip=0&limit=100`

Retrieve all customers.

**Query Parameters:**
- `skip`: Number to skip (default: 0)
- `limit`: Maximum to return (default: 100)

**Response (200 OK):**
Array of customer objects (same structure as create response)

**Curl Example:**
```bash
curl http://localhost:8000/customers
```

---

### Get Customer by ID

**Endpoint:** `GET /customers/{customer_id}`

**Response (200 OK):** Single customer object

---

### Delete Customer

**Endpoint:** `DELETE /customers/{customer_id}`

**Response:** `204 No Content`

---

## Orders

### Create Order

**Endpoint:** `POST /orders`

Create a new order. ⚠️ **Stock will be automatically reduced.**

**Request Body:**
```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

**Requirements:**
- `customer_id`: Required, integer > 0
- `items`: Required, array with at least 1 item
  - `product_id`: Required, integer > 0
  - `quantity`: Required, integer > 0

**Business Logic:**
- Customer must exist
- All products must exist
- Sufficient stock required for each product
- Total amount calculated automatically
- Stock reduced automatically on success

**Response (201 Created):**
```json
{
  "id": 1,
  "customer_id": 1,
  "total_amount": 2059.97,
  "order_date": "2024-01-15T10:50:00",
  "created_at": "2024-01-15T10:50:00",
  "updated_at": "2024-01-15T10:50:00"
}
```

**Error Response (400 Bad Request - Insufficient Stock):**
```json
{
  "detail": "Insufficient stock for product 'Laptop'. Available: 2, Requested: 5"
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Customer not found"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      }
    ]
  }'
```

---

### Get All Orders

**Endpoint:** `GET /orders?skip=0&limit=100`

Retrieve all orders.

**Response (200 OK):** Array of order objects

**Curl Example:**
```bash
curl http://localhost:8000/orders
```

---

### Get Order by ID

**Endpoint:** `GET /orders/{order_id}`

Get detailed order information including customer and products.

**Response (200 OK):**
```json
{
  "id": 1,
  "customer_id": 1,
  "total_amount": 2059.97,
  "order_date": "2024-01-15T10:50:00",
  "created_at": "2024-01-15T10:50:00",
  "updated_at": "2024-01-15T10:50:00",
  "customer": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "created_at": "2024-01-15T10:40:00",
    "updated_at": "2024-01-15T10:40:00"
  },
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "sku": "LAP-001",
      "quantity": 2,
      "price_at_order": 999.99
    },
    {
      "id": 2,
      "name": "Mouse",
      "sku": "MOUSE-001",
      "quantity": 1,
      "price_at_order": 29.99
    }
  ]
}
```

---

### Cancel Order

**Endpoint:** `DELETE /orders/{order_id}`

Cancel an order. ⚠️ **Stock will be restored automatically.**

**Response:** `204 No Content`

**Curl Example:**
```bash
curl -X DELETE http://localhost:8000/orders/1
```

---

## Dashboard

### Get Dashboard Summary

**Endpoint:** `GET /dashboard`

Get key metrics and low stock products.

**Response (200 OK):**
```json
{
  "total_products": 25,
  "total_customers": 10,
  "total_orders": 5,
  "inventory_value": 15234.50,
  "low_stock_products": [
    {
      "id": 1,
      "name": "Laptop",
      "sku": "LAP-001",
      "quantity_in_stock": 2
    }
  ]
}
```

**Note:** "Low stock" = quantity < 10

**Curl Example:**
```bash
curl http://localhost:8000/dashboard
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET request |
| 201 | Created | Product/customer/order created |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, duplicate SKU/email |
| 404 | Not Found | Product/customer not found |
| 422 | Unprocessable Entity | Invalid data type |
| 500 | Server Error | Unexpected error |

### Error Response Format

```json
{
  "detail": "Error description here"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Production deployment should consider:
- Implementing rate limits (50-100 requests/minute per IP)
- Using Redis for caching
- Implementing request throttling

---

## Authentication

Currently no authentication is implemented. For production:
- Implement JWT tokens
- Add user roles (admin, customer, viewer)
- Secure sensitive endpoints

---

## CORS

CORS is enabled for all origins (`*`). For production:
```python
# Restrict to specific frontend domain
allow_origins=[
    "https://your-frontend.vercel.app",
    "https://your-frontend.netlify.app"
]
```

---

## Testing Workflow

```bash
# 1. Create a product
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","sku":"TEST001","price":100,"quantity_in_stock":10}'

# 2. Create a customer  
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@test.com","phone_number":"1234567890"}'

# 3. Create an order
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"items":[{"product_id":1,"quantity":2}]}'

# 4. Check dashboard
curl http://localhost:8000/dashboard

# 5. Get order details
curl http://localhost:8000/orders/1
```

---

## API Documentation UI

Two interactive documentation interfaces available:

1. **Swagger UI**: http://localhost:8000/docs
2. **ReDoc**: http://localhost:8000/redoc

These are auto-generated from your FastAPI code and show live API testing.

---

## Best Practices

1. ✅ Always validate data before sending
2. ✅ Handle errors gracefully
3. ✅ Use appropriate HTTP methods
4. ✅ Include Content-Type header for POST/PUT
5. ✅ Test with sample data before production
6. ✅ Monitor API logs for errors
7. ✅ Implement pagination for large datasets
8. ✅ Cache frequently accessed data

---

**For more details, visit:** http://localhost:8000/docs
