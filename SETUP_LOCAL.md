# 🚀 Local Setup & Running Instructions

## Complete Guide to Run the Inventory & Order Management System Locally

### ✅ Prerequisites

Before you begin, make sure you have the following installed on your machine:

1. **Docker** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
2. **Docker Compose** - Usually comes with Docker Desktop
3. **Git** - [Download Git](https://git-scm.com/)
4. **Node.js & npm** - [Download Node.js](https://nodejs.org/) (only if running frontend without Docker)
5. **Python 3.11+** - [Download Python](https://www.python.org/) (only if running backend without Docker)

---

## Method 1: Using Docker Compose (Recommended) ⚡

This is the easiest and most reliable way to run the entire application with all services.

### Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd ethara-ai
```

### Step 2: Setup Environment Variables

The `.env` file is already configured for local development:

```bash
# File: .env
DB_USER=inventory_user
DB_PASSWORD=inventory_password_secure_123
DB_NAME=inventory_db
DB_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=3000
SECRET_KEY=your-secret-key-change-in-production-12345
ENVIRONMENT=development
REACT_APP_API_URL=http://localhost:8000
```

### Step 3: Start All Services

```bash
docker-compose up --build
```

This command will:
- Build the backend Docker image
- Build the frontend Docker image
- Create and start the PostgreSQL database container
- Create and start the backend API container
- Create and start the frontend container
- Set up all networking between services

### Step 4: Wait for Services to Start

The output will show logs from all three containers. Wait until you see:
- Backend: `Uvicorn running on http://0.0.0.0:8000`
- Frontend: `ready - started server on 0.0.0.0:3000`
- Database: `database system is ready to accept connections`

**Note:** The first startup may take 2-3 minutes as Docker builds the images and initializes the database.

### Step 5: Access the Application

Open your browser and navigate to:

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/docs
- **API Alternative Docs (ReDoc)**: http://localhost:8000/redoc

### Step 6: Test the Application

1. **Create a Product**:
   - Navigate to "Products" tab
   - Click "Add New Product"
   - Fill in: Name, SKU, Price, Quantity
   - Click "Add Product"

2. **Create a Customer**:
   - Navigate to "Customers" tab
   - Click "Add New Customer"
   - Fill in: Full Name, Email, Phone Number
   - Click "Add Customer"

3. **Create an Order**:
   - Navigate to "Orders" tab
   - Click "Create New Order"
   - Select a Customer
   - Add Product(s) with Quantity
   - Click "Create Order"

4. **View Dashboard**:
   - Navigate to "Dashboard"
   - See summary metrics and low stock products

### Step 7: Stop the Application

```bash
docker-compose down
```

To stop and remove volumes (database data):

```bash
docker-compose down -v
```

---

## Method 2: Manual Setup (Without Docker)

If you prefer running services individually without Docker:

### Backend Setup

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Setup Database (PostgreSQL)

You need a running PostgreSQL instance:

```bash
# Install PostgreSQL if you don't have it
# Then create database and user:

psql -U postgres
CREATE USER inventory_user WITH PASSWORD 'inventory_password_secure_123';
CREATE DATABASE inventory_db OWNER inventory_user;
\q
```

#### Step 5: Configure Environment

Update the database connection in `.env`:

```bash
DATABASE_URL=postgresql://inventory_user:inventory_password_secure_123@localhost:5432/inventory_db
```

#### Step 6: Run Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be running at: http://localhost:8000

### Frontend Setup

#### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Configure Environment

Create `.env.local` or update the existing configuration:

```bash
REACT_APP_API_URL=http://localhost:8000
```

#### Step 4: Run Frontend

```bash
npm start
```

Frontend will open at: http://localhost:3000

---

## Troubleshooting

### Issue: Port Already in Use

**Problem**: Port 8000 or 3000 is already in use

**Solution**:
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Issue: Docker Container Exits Immediately

**Problem**: Container starts but exits

**Solution**:
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose up --build --no-cache
```

### Issue: Database Connection Error

**Problem**: Backend can't connect to database

**Solution**:
```bash
# Check PostgreSQL is running
docker-compose logs db

# Verify DATABASE_URL in .env
# Restart database
docker-compose restart db
```

### Issue: CORS Errors

**Problem**: Frontend can't communicate with backend

**Solution**: Ensure `REACT_APP_API_URL=http://localhost:8000` is set correctly

### Issue: npm install Fails

**Problem**: npm dependencies fail to install

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## Database Management

### Access PostgreSQL Directly

```bash
docker exec -it inventory-db psql -U inventory_user -d inventory_db
```

### Common SQL Commands

```sql
-- List all tables
\dt

-- View products
SELECT * FROM products;

-- View customers
SELECT * FROM customers;

-- View orders
SELECT * FROM orders;

-- Exit
\q
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
```

---

## API Testing with Curl

### Create a Product

```bash
curl -X POST "http://localhost:8000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP001",
    "price": 999.99,
    "quantity_in_stock": 10
  }'
```

### Get All Products

```bash
curl "http://localhost:8000/products"
```

### Create a Customer

```bash
curl -X POST "http://localhost:8000/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890"
  }'
```

### Create an Order

```bash
curl -X POST "http://localhost:8000/orders" \
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

### Get Dashboard

```bash
curl "http://localhost:8000/dashboard"
```

---

## Development Tips

### Hot Reload Backend

```bash
# The backend uses --reload flag automatically
# Changes to Python files are reflected immediately
```

### Hot Reload Frontend

```bash
# Frontend automatically reloads on file changes
# Open DevTools (F12) and check Console for errors
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Scale Services

```bash
# Run multiple backend instances
docker-compose up --scale backend=3
```

---

## Performance Monitoring

### Check Container Resource Usage

```bash
docker stats
```

### Monitor Database Connections

```bash
docker exec -it inventory-db psql -U inventory_user -d inventory_db \
  -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

---

## Production Deployment

For deploying to production, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## Support & Documentation

- **Backend API Docs**: http://localhost:8000/docs
- **Frontend Components**: See `frontend/src/components/`
- **Database Schema**: See `backend/models.py`
- **API Schemas**: See `backend/schemas.py`

---

## Next Steps

After successful local setup:
1. ✅ Explore the application UI
2. ✅ Test all CRUD operations
3. ✅ Review API documentation
4. ✅ Read the deployment guide for production deployment
5. ✅ Customize for your needs

---

**Happy Coding! 🎉**
