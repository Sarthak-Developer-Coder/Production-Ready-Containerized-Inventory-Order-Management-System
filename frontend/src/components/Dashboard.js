import './styles.css';

export default function Dashboard({ data, loading, error }) {
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📦 Total Products</h3>
          <p className="metric">{data?.total_products || 0}</p>
        </div>
        <div className="dashboard-card">
          <h3>👥 Total Customers</h3>
          <p className="metric">{data?.total_customers || 0}</p>
        </div>
        <div className="dashboard-card">
          <h3>🛒 Total Orders</h3>
          <p className="metric">{data?.total_orders || 0}</p>
        </div>
        <div className="dashboard-card">
          <h3>💰 Inventory Value</h3>
          <p className="metric">${data?.inventory_value?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {data?.low_stock_products && data.low_stock_products.length > 0 && (
        <div className="low-stock-section">
          <h2>⚠️ Low Stock Products</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Stock Qty</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock_products.map((product) => (
                <tr key={product.id} className="low-stock-row">
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td className="stock-warning">{product.quantity_in_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
