import { useState, useEffect } from 'react';
import './styles.css';

export default function OrderList({ orders, onDelete, loading }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0) {
    return <div className="empty-state">No orders found. Create one to get started!</div>;
  }

  return (
    <div className="orders-container">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header" onClick={() => toggleExpand(order.id)}>
            <div className="order-info">
              <h3>Order #{order.id}</h3>
              <p>Customer ID: {order.customer_id}</p>
              <p>Total: <strong>${order.total_amount.toFixed(2)}</strong></p>
            </div>
            <div className="order-date">
              {new Date(order.order_date).toLocaleDateString()}
            </div>
            <button className="btn btn-sm btn-info">
              {expandedOrder === order.id ? '▼' : '▶'} Details
            </button>
          </div>

          {expandedOrder === order.id && (
            <div className="order-details">
              <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</p>
              <button onClick={() => onDelete(order.id)} className="btn btn-danger">
                Cancel Order
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
