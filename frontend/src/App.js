import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import { productAPI, customerAPI, orderAPI, dashboardAPI } from './api';

function App() {
  // State management
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all data on component mount
  const loadAllData = useCallback(() => {
    fetchProducts();
    fetchCustomers();
    fetchOrders();
    fetchDashboard();
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Fetch functions
  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load products');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load customers');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load orders');
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getSummary();
      setDashboardData(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load dashboard data');
    }
  };

  // Message handler
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Product handlers
  const handleAddProduct = async (productData) => {
    setLoading(true);
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData);
        showMessage('success', 'Product updated successfully!');
        setEditingProduct(null);
      } else {
        await productAPI.create(productData);
        showMessage('success', 'Product created successfully!');
      }
      fetchProducts();
      fetchDashboard();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to save product';
      showMessage('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setCurrentPage('products');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        showMessage('success', 'Product deleted successfully!');
        fetchProducts();
        fetchDashboard();
      } catch (error) {
        showMessage('error', 'Failed to delete product');
      }
    }
  };

  // Customer handlers
  const handleAddCustomer = async (customerData) => {
    setLoading(true);
    try {
      await customerAPI.create(customerData);
      showMessage('success', 'Customer created successfully!');
      fetchCustomers();
      fetchDashboard();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to create customer';
      showMessage('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        showMessage('success', 'Customer deleted successfully!');
        fetchCustomers();
        fetchDashboard();
      } catch (error) {
        showMessage('error', 'Failed to delete customer');
      }
    }
  };

  // Order handlers
  const handleCreateOrder = async (orderData) => {
    setLoading(true);
    try {
      await orderAPI.create(orderData);
      showMessage('success', 'Order created successfully!');
      fetchOrders();
      fetchProducts(); // Refresh stock
      fetchDashboard();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to create order';
      showMessage('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.delete(id);
        showMessage('success', 'Order cancelled successfully!');
        fetchOrders();
        fetchProducts(); // Restore stock
        fetchDashboard();
      } catch (error) {
        showMessage('error', 'Failed to cancel order');
      }
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>📦 Inventory & Order Management System</h1>
          <p>Professional inventory management for modern businesses</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <ul>
            <li><a href="#/" onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>📊 Dashboard</a></li>
            <li><a href="#/" onClick={() => { setCurrentPage('products'); setEditingProduct(null); }} className={currentPage === 'products' ? 'active' : ''}>📦 Products</a></li>
            <li><a href="#/" onClick={() => setCurrentPage('customers')} className={currentPage === 'customers' ? 'active' : ''}>👥 Customers</a></li>
            <li><a href="#/" onClick={() => setCurrentPage('orders')} className={currentPage === 'orders' ? 'active' : ''}>🛒 Orders</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container main-content">
        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? '✓' : '✗'} {message.text}
          </div>
        )}

        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <div className="page">
            <Dashboard data={dashboardData} loading={loading} error={null} />
          </div>
        )}

        {/* Products Page */}
        {currentPage === 'products' && (
          <div className="page">
            <div className="section-header">
              <h1>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h1>
            </div>
            <ProductForm onSubmit={handleAddProduct} initialData={editingProduct} loading={loading} />
            <div className="section-header">
              <h1>📋 Product List</h1>
            </div>
            <ProductList products={products} onDelete={handleDeleteProduct} onEdit={handleEditProduct} loading={loading} />
          </div>
        )}

        {/* Customers Page */}
        {currentPage === 'customers' && (
          <div className="page">
            <div className="section-header">
              <h1>➕ Add New Customer</h1>
            </div>
            <CustomerForm onSubmit={handleAddCustomer} loading={loading} />
            <div className="section-header">
              <h1>📋 Customer List</h1>
            </div>
            <CustomerList customers={customers} onDelete={handleDeleteCustomer} loading={loading} />
          </div>
        )}

        {/* Orders Page */}
        {currentPage === 'orders' && (
          <div className="page">
            <div className="section-header">
              <h1>🛒 Create New Order</h1>
            </div>
            <OrderForm customers={customers} products={products} onSubmit={handleCreateOrder} loading={loading} />
            <div className="section-header">
              <h1>📋 Order List</h1>
            </div>
            <OrderList orders={orders} onDelete={handleCancelOrder} loading={loading} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Inventory Management System | Built with React & FastAPI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
