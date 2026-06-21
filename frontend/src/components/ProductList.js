import './styles.css';

export default function ProductList({ products, onDelete, onEdit, loading }) {
  if (loading) return <div className="loading">Loading products...</div>;

  if (products.length === 0) {
    return <div className="empty-state">No products found. Create one to get started!</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td><span className="badge">{product.sku}</span></td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <span className={`stock-badge ${product.quantity_in_stock < 10 ? 'low-stock' : ''}`}>
                  {product.quantity_in_stock}
                </span>
              </td>
              <td>
                <button onClick={() => onEdit(product)} className="btn btn-sm btn-info">
                  Edit
                </button>
                <button onClick={() => onDelete(product.id)} className="btn btn-sm btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
