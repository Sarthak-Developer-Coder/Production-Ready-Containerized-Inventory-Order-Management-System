# 📚 API Testing Guide

This guide provides curl commands to test all API endpoints. The API runs at `http://localhost:8000` locally.

## Health Check

```bash
curl http://localhost:8000/health
```

## Products API

### Create Product
```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "sku": "MOUSE-001",
    "price": 29.99,
    "quantity_in_stock": 100
  }'
```

### Get All Products
```bash
curl http://localhost:8000/products
```

### Get Specific Product
```bash
curl http://localhost:8000/products/1
```

### Update Product
```bash
curl -X PUT http://localhost:8000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Mouse",
    "price": 34.99
  }'
```

### Delete Product
```bash
curl -X DELETE http://localhost:8000/products/1
```

## Customers API

### Create Customer
```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Alice Johnson",
    "email": "alice@example.com",
    "phone_number": "+1-555-0101"
  }'
```

### Get All Customers
```bash
curl http://localhost:8000/customers
```

### Get Specific Customer
```bash
curl http://localhost:8000/customers/1
```

### Delete Customer
```bash
curl -X DELETE http://localhost:8000/customers/1
```

## Orders API

### Create Order
```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 5
      },
      {
        "product_id": 2,
        "quantity": 3
      }
    ]
  }'
```

### Get All Orders
```bash
curl http://localhost:8000/orders
```

### Get Order Details
```bash
curl http://localhost:8000/orders/1
```

### Cancel Order (Restores Stock)
```bash
curl -X DELETE http://localhost:8000/orders/1
```

## Dashboard API

### Get Dashboard Summary
```bash
curl http://localhost:8000/dashboard
```

## Error Handling Examples

### Duplicate Email (Customer)
```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Bob Smith",
    "email": "alice@example.com",
    "phone_number": "+1-555-0202"
  }'
# Returns: 400 Bad Request - "Customer email must be unique"
```

### Insufficient Stock
```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 10000
      }
    ]
  }'
# Returns: 400 Bad Request - "Insufficient stock for product..."
```

### Invalid Email Format
```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Invalid Customer",
    "email": "not-an-email",
    "phone_number": "+1-555-0303"
  }'
# Returns: 422 Unprocessable Entity - "invalid email format"
```

## Batch Testing Script

Create `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000"

echo "🧪 Testing Inventory API..."

# Create Products
echo -e "\n✏️ Creating products..."
curl -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","sku":"KB-001","price":79.99,"quantity_in_stock":50}'

curl -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Monitor","sku":"MON-001","price":299.99,"quantity_in_stock":20}'

# Get Products
echo -e "\n\n📋 Getting all products..."
curl $BASE_URL/products | jq

# Create Customer
echo -e "\n\n✏️ Creating customer..."
curl -X POST $BASE_URL/customers \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","email":"john@test.com","phone_number":"+1-555-0101"}' | jq

# Create Order
echo -e "\n\n✏️ Creating order..."
curl -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"items":[{"product_id":1,"quantity":5}]}' | jq

# Get Dashboard
echo -e "\n\n📊 Dashboard Summary..."
curl $BASE_URL/dashboard | jq

echo -e "\n\n✅ Testing complete!"
```

Run with:
```bash
chmod +x test_api.sh
./test_api.sh
```

## Interactive Testing with Swagger UI

1. Open http://localhost:8000/docs
2. Click any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. See response

## Performance Testing

### Load Test with Apache Bench
```bash
# Get 100 requests with concurrency of 10
ab -n 100 -c 10 http://localhost:8000/products
```

### Using wrk
```bash
# Install wrk (if not installed)
# macOS: brew install wrk
# Ubuntu: apt-get install wrk

wrk -t12 -c400 -d30s http://localhost:8000/dashboard
```

## API Response Formats

### Success Response (200)
```json
{
  "id": 1,
  "name": "Product Name",
  "sku": "SKU-001",
  "price": 99.99,
  "quantity_in_stock": 50,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Error Response (400/422/404)
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Validation Error (422)
```json
{
  "detail": [
    {
      "loc": ["body", "price"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error.number.not_gt"
    }
  ]
}
```

---

**Happy testing!** 🎉

For more details, see the [README.md](./README.md)
