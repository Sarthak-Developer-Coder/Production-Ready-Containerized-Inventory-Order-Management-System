# Inventory & Order Management System

A production-ready, full-stack inventory and order management system built with **React**, **FastAPI**, **PostgreSQL**, and **Docker**.

## 📋 Features

- **Product Management**: Create, read, update, delete products with SKU tracking
- **Customer Management**: Manage customers with unique email addresses
- **Order Management**: Create orders with inventory validation and automatic stock reduction
- **Dashboard**: Real-time inventory metrics and low-stock alerts
- **Responsive UI**: Mobile-friendly, modern design
- **API Documentation**: Auto-generated Swagger/OpenAPI docs
- **Docker Support**: Full containerization with Docker Compose
- **Environment Configuration**: Secure environment variable management

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- OR Node.js 18+ & Python 3.11+

### With Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd inventory-management
   ```

2. **Configure environment**
   ```bash
   # Already included, but customize if needed
   cat .env
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Without Docker (Local Development)

#### Backend Setup

1. **Create Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up database**
   - Install PostgreSQL locally
   - Create database: `inventory_db`
   - Update `config.py` with your database credentials

4. **Run backend**
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
inventory-management/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── config.py           # App configuration
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker image
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api.js          # API integration
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json        # Node dependencies
│   └── Dockerfile          # Frontend Docker image
├── docker-compose.yml      # Docker Compose configuration
├── .env                    # Environment variables
└── README.md              # This file
```

## 🔌 API Endpoints

### Products
- `POST /products` - Create product
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Customers
- `POST /customers` - Create customer
- `GET /customers` - Get all customers
- `GET /customers/{id}` - Get customer by ID
- `DELETE /customers/{id}` - Delete customer

### Orders
- `POST /orders` - Create order
- `GET /orders` - Get all orders
- `GET /orders/{id}` - Get order details
- `DELETE /orders/{id}` - Cancel order

### Dashboard
- `GET /dashboard` - Get dashboard summary
- `GET /health` - Health check

## 📊 Business Logic

✅ **Unique Constraints**
- Product SKU must be unique
- Customer email must be unique

✅ **Inventory Management**
- Orders fail if stock is insufficient
- Stock automatically reduces on order creation
- Stock restores on order cancellation

✅ **Validation**
- All inputs validated before processing
- Proper HTTP status codes returned
- Detailed error messages provided

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Stop and remove volumes
docker-compose down -v
```

## 🌐 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Create new project on Vercel
3. Connect GitHub repository
4. Set `REACT_APP_API_URL` environment variable
5. Deploy

## 📝 Environment Variables

```env
# Database
DB_USER=inventory_user
DB_PASSWORD=secure_password
DB_NAME=inventory_db

# Backend
SECRET_KEY=your-secret-key
ENVIRONMENT=production

# Frontend
REACT_APP_API_URL=https://your-backend-api.com
```

## 🛠️ Development

### Running Tests (Backend)
```bash
cd backend
pytest
```

### API Documentation
Navigate to `http://localhost:8000/docs` for interactive Swagger UI

### Code Style
- Backend: Follow PEP 8
- Frontend: Follow ESLint configuration

## 📦 Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Frontend | React 18, Axios |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |
| Hosting | Render, Vercel |

## 🔐 Security Features

- Environment variables for sensitive data
- Input validation on all endpoints
- CORS configuration
- SQL injection prevention (SQLAlchemy ORM)
- Secure password handling

## 📄 License

MIT License

## 👤 Author

Built as a production-ready assessment

---

**Ready to deploy?** Follow the deployment section above to get your application live!
