// ProductPage.js - Product management component
import React, { useState, useEffect } from 'react';
import { productService } from '../services/apiService';
import { apiUtils } from '../services/apiService';

const ProductPage = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: ''
  });

  // Load products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Load all products from backend
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      stock: '',
      description: ''
    });
    setEditingProduct(null);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic form validation
      if (!formData.name || !formData.price || !formData.category || !formData.stock) {
        setError('Please fill in all required fields (Name, Price, Category, Stock)');
        return;
      }

      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        // Update existing product
        await productService.updateProduct(editingProduct.id, productData);
        setSuccess('Product updated successfully!');
      } else {
        // Create new product
        await productService.createProduct(productData);
        setSuccess('Product created successfully!');
      }

      // Reset form and reload data
      resetForm();
      loadProducts();
      
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      description: product.description || ''
    });
    setEditingProduct(product);
  };

  // Handle delete button click
  const handleDelete = async (product) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await productService.deleteProduct(product.id);
        setSuccess('Product deleted successfully!');
        loadProducts();
      } catch (err) {
        setError(apiUtils.formatErrorMessage(err));
      }
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(price);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Product Management</h1>
      <p className="page-description">
        Manage your product inventory. Add new products, update existing ones, and maintain stock levels.
      </p>

      {/* Success/Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Product Form */}
      <div className="form-container">
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">Price (NZD) *</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Appliances">Appliances</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Stock */}
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="form-control"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          {/* Description (full width) */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description..."
              rows="3"
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Product List ({products.length} products)</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="alert alert-info">
            No products found. Add your first product using the form above.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span style={{
                      background: '#e9ecef',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '15px',
                      fontSize: '0.9rem'
                    }}>
                      {product.category}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      color: product.stock < 10 ? '#e74c3c' : '#27ae60',
                      fontWeight: 'bold'
                    }}>
                      {product.stock}
                      {product.stock < 10 && ' ⚠️'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    {product.description ? (
                      <span title={product.description}>
                        {product.description.length > 50 
                          ? product.description.substring(0, 50) + '...'
                          : product.description
                        }
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>No description</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(product)}
                        title="Edit Product"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(product)}
                        title="Delete Product"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Statistics */}
      {products.length > 0 && (
        <div className="page-container" style={{ marginTop: '2rem', background: '#f8f9fa' }}>
          <h3>📊 Inventory Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#3498db' }}>
                {products.length}
              </strong>
              <p>Total Products</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#27ae60' }}>
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </strong>
              <p>Total Stock Items</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#e74c3c' }}>
                {products.filter(p => p.stock < 10).length}
              </strong>
              <p>Low Stock Alert</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#9b59b6' }}>
                {new Set(products.map(p => p.category)).size}
              </strong>
              <p>Categories</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;