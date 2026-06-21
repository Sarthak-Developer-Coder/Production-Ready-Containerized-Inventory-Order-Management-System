from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from datetime import datetime

from database import engine, get_db, Base
from models import Product, Customer, Order, order_items
import schemas

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory & Order Management System",
    description="A production-ready inventory management API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== PRODUCT ENDPOINTS ====================

@app.post("/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Create a new product with unique SKU."""
    try:
        db_product = Product(**product.dict())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product SKU must be unique"
        )

@app.get("/products", response_model=List[schemas.ProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieve all products with pagination."""
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific product by ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    product_update: schemas.ProductUpdate,
    db: Session = Depends(get_db)
):
    """Update product details."""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db_product.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(db_product)
        return db_product
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product SKU must be unique"
        )

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    db.delete(product)
    db.commit()
    return None

# ==================== CUSTOMER ENDPOINTS ====================

@app.post("/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    """Create a new customer with unique email."""
    try:
        db_customer = Customer(**customer.dict())
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        return db_customer
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer email must be unique"
        )

@app.get("/customers", response_model=List[schemas.CustomerResponse])
def get_all_customers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieve all customers with pagination."""
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers

@app.get("/customers/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific customer by ID."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    return customer

@app.delete("/customers/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """Delete a customer."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    db.delete(customer)
    db.commit()
    return None

# ==================== ORDER ENDPOINTS ====================

@app.post("/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_create: schemas.OrderCreate, db: Session = Depends(get_db)):
    """Create a new order with inventory validation and automatic stock reduction."""
    
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == order_create.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Validate and fetch all products, check inventory
    products_data = []
    total_amount = 0.0
    
    for item in order_create.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )
        
        # Validate stock availability
        if product.quantity_in_stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.quantity_in_stock}, Requested: {item.quantity}"
            )
        
        # Calculate total amount
        item_total = product.price * item.quantity
        total_amount += item_total
        products_data.append({
            "product": product,
            "quantity": item.quantity,
            "price": product.price
        })
    
    # Create order
    db_order = Order(
        customer_id=order_create.customer_id,
        total_amount=total_amount
    )
    db.add(db_order)
    db.flush()  # Get the order ID without committing
    
    # Reduce stock for all products
    for product_data in products_data:
        product = product_data["product"]
        quantity = product_data["quantity"]
        
        product.quantity_in_stock -= quantity
        product.updated_at = datetime.utcnow()
        
        # Add product to order
        db.execute(
            order_items.insert().values(
                order_id=db_order.id,
                product_id=product.id,
                quantity=quantity,
                price_at_order=product_data["price"]
            )
        )
    
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders", response_model=List[schemas.OrderResponse])
def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieve all orders with pagination."""
    orders = db.query(Order).offset(skip).limit(limit).all()
    return orders

@app.get("/orders/{order_id}", response_model=schemas.OrderDetailResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Retrieve order details by ID including customer and products."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Fetch order items with product and pricing information
    products_info = []
    for product in order.products:
        # Get the price at the time of order
        stmt = order_items.select().where(
            (order_items.c.order_id == order_id) & 
            (order_items.c.product_id == product.id)
        )
        result = db.execute(stmt).first()
        if result:
            products_info.append({
                "id": product.id,
                "name": product.name,
                "sku": product.sku,
                "quantity": result.quantity,
                "price_at_order": result.price_at_order
            })
    
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer": order.customer,
        "total_amount": order.total_amount,
        "order_date": order.order_date,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
        "products": products_info
    }

@app.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    """Cancel/Delete an order and restore stock."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Restore stock for all products in this order
    for product in order.products:
        stmt = order_items.select().where(
            (order_items.c.order_id == order_id) & 
            (order_items.c.product_id == product.id)
        )
        result = db.execute(stmt).first()
        if result:
            product.quantity_in_stock += result.quantity
            product.updated_at = datetime.utcnow()
    
    db.delete(order)
    db.commit()
    return None

# ==================== DASHBOARD ENDPOINT ====================

@app.get("/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary with key metrics."""
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    
    # Find low stock products (quantity < 10)
    low_stock_products = db.query(Product).filter(
        Product.quantity_in_stock < 10
    ).all()
    
    total_inventory_value = db.query(Product).all()
    inventory_value = sum(p.price * p.quantity_in_stock for p in total_inventory_value)
    
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "inventory_value": round(inventory_value, 2),
        "low_stock_products": [
            {
                "id": p.id,
                "name": p.name,
                "sku": p.sku,
                "quantity_in_stock": p.quantity_in_stock
            }
            for p in low_stock_products
        ]
    }

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
