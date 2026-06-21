import { useState } from 'react';
import './styles.css';

export default function OrderForm({ customers, products, onSubmit, loading }) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: '' }]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!customerId) newErrors.customerId = 'Please select a customer';
    if (items.length === 0) newErrors.items = 'Add at least one product to order';
    
    items.forEach((item, idx) => {
      if (!item.product_id) newErrors[`product_${idx}`] = 'Select a product';
      if (!item.quantity || item.quantity <= 0) newErrors[`quantity_${idx}`] = 'Quantity must be > 0';
    });
    
    return newErrors;
  };

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    if (errors[`${field}_${index}`]) {
      setErrors((prev) => ({
        ...prev,
        [`${field}_${index}`]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      customer_id: parseInt(customerId),
      items: items.map((item) => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity),
      })),
    });

    setCustomerId('');
    setItems([{ product_id: '', quantity: '' }]);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Customer *</label>
        <select
          value={customerId}
          onChange={(e) => {
            setCustomerId(e.target.value);
            setErrors((prev) => ({ ...prev, customerId: '' }));
          }}
          className={errors.customerId ? 'input-error' : ''}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.full_name} ({customer.email})
            </option>
          ))}
        </select>
        {errors.customerId && <span className="error-text">{errors.customerId}</span>}
      </div>

      <div className="order-items">
        <h3>Order Items</h3>
        {items.map((item, index) => (
          <div key={index} className="order-item-row">
            <div className="form-group">
              <label>Product *</label>
              <select
                value={item.product_id}
                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                className={errors[`product_${index}`] ? 'input-error' : ''}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.quantity_in_stock}, ${product.price})
                  </option>
                ))}
              </select>
              {errors[`product_${index}`] && (
                <span className="error-text">{errors[`product_${index}`]}</span>
              )}
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                placeholder="0"
                className={errors[`quantity_${index}`] ? 'input-error' : ''}
              />
              {errors[`quantity_${index}`] && (
                <span className="error-text">{errors[`quantity_${index}`]}</span>
              )}
            </div>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="btn btn-danger"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddItem} className="btn btn-secondary">
          + Add Another Product
        </button>
      </div>

      {errors.items && <span className="error-text">{errors.items}</span>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating Order...' : 'Create Order'}
      </button>
    </form>
  );
}
