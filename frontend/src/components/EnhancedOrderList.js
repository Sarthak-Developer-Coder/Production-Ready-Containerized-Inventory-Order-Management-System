import { useMemo, useState } from 'react';
import './styles.css';

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return '';
  }
}

function formatDateTime(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return '';
  }
}

export default function EnhancedOrderList({ orders = [], onDelete, loading }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const hasOrders = useMemo(() => Array.isArray(orders) && orders.length > 0, [orders]);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (!hasOrders) return <div className="empty-state">No orders found. Create one to get started!</div>;

  return (
    <div className="orders-container">
      {orders.map((order) => {
        const isOpen = expandedOrderId === order.id;
        return (
          <div key={order.id} className="order-card">
            <div
              className="order-header"
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => setExpandedOrderId(isOpen ? null : order.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setExpandedOrderId(isOpen ? null : order.id);
              }}
            >
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <p>Customer ID: {order.customer_id}</p>
                <p>
                  Total:{' '}
                  <strong>${Number(order.total_amount || 0).toFixed(2)}</strong>
                </p>
              </div>

              <div className="order-date">{formatDate(order.order_date)}</div>

              <button type="button" className="btn btn-sm btn-info">
                {isOpen ? '▲' : '▼'} Details
              </button>
            </div>

            {isOpen && (
              <div className="order-details">
                <div className="order-items">
                  <h3 className="order-summary-title">Order Summary</h3>

                  <p>
                    <strong>Order Date:</strong> {formatDateTime(order.order_date)}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ${Number(order.total_amount || 0).toFixed(2)}
                  </p>

                  <div className="table-actions" style={{ marginTop: 10 }}>
                    <button type="button" className="btn btn-danger" onClick={() => onDelete(order.id)}>
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

