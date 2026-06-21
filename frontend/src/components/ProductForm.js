import { useState } from 'react';
import './styles.css';

export default function ProductForm({ onSubmit, initialData, loading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    price: initialData?.price || '',
    quantity_in_stock: initialData?.quantity_in_stock || '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.quantity_in_stock === '' || formData.quantity_in_stock < 0)
      newErrors.quantity_in_stock = 'Quantity must be non-negative';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity_in_stock' ? parseFloat(value) || '' : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
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
    onSubmit(formData);
    setFormData({ name: '', sku: '', price: '', quantity_in_stock: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>SKU/Code *</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="Enter product SKU"
          className={errors.sku ? 'input-error' : ''}
        />
        {errors.sku && <span className="error-text">{errors.sku}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price ($) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className={errors.price ? 'input-error' : ''}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label>Quantity in Stock *</label>
          <input
            type="number"
            name="quantity_in_stock"
            value={formData.quantity_in_stock}
            onChange={handleChange}
            placeholder="0"
            className={errors.quantity_in_stock ? 'input-error' : ''}
          />
          {errors.quantity_in_stock && <span className="error-text">{errors.quantity_in_stock}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}
