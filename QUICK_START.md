# 🚀 Quick Start Guide

## Local Development (Docker Compose)

### Prerequisites
- Docker Desktop installed and running
- Git installed

### Steps

1. **Clone or navigate to project**
   ```bash
   cd "c:\Users\sarth\OneDrive\Desktop\ethara ai"
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to be ready** (usually 30-60 seconds)
   ```bash
   docker-compose ps
   # All services should show "Up"
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Database Admin**: Use pgAdmin or connect with PostgreSQL client

5. **View logs** (if needed)
   ```bash
   docker-compose logs -f backend    # Backend logs
   docker-compose logs -f frontend   # Frontend logs
   docker-compose logs -f db         # Database logs
   ```

## Testing the Application

### Create a Product

1. Click "📦 Products" tab
2. Fill in the form:
   - Product Name: "Laptop"
   - SKU: "LAP-001"
   - Price: 999.99
   - Quantity: 50
3. Click "Add Product"
4. Verify it appears in the product list

### Create a Customer

1. Click "👥 Customers" tab
2. Fill in the form:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "+1234567890"
3. Click "Add Customer"
4. Verify it appears in the customer list

### Create an Order

1. Click "🛒 Orders" tab
2. Fill in the form:
   - Customer: Select "John Doe"
   - Product: Select "Laptop (Stock: 50)"
   - Quantity: 5
3. Click "Create Order"
4. Verify:
   - Order appears in orders list
   - Product stock reduced from 50 to 45
   - Total amount calculated correctly

### View Dashboard

1. Click "📊 Dashboard"
2. See metrics:
   - Total Products
   - Total Customers
   - Total Orders
   - Inventory Value
   - Low Stock Products (warnings)

## Stopping the Application

```bash
docker-compose down
```

## Resetting Database

```bash
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Port Already in Use
If port 3000 or 8000 is in use:
```bash
# Change in .env file
FRONTEND_PORT=3001
BACKEND_PORT=8001
```

### Database Connection Error
```bash
# Check database is running
docker-compose ps

# View database logs
docker-compose logs db
```

### Frontend Can't Connect to Backend
1. Check `.env` file has `REACT_APP_API_URL=http://localhost:8000`
2. Verify backend is running: http://localhost:8000/health
3. Check browser console for CORS errors

## Next Steps

1. Customize the `.env` file for your environment
2. Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment
3. Explore API docs at http://localhost:8000/docs
4. Deploy to Render (backend) and Vercel/Netlify (frontend)

---

**Need help?** Check the README.md or DEPLOYMENT_GUIDE.md for more information.
