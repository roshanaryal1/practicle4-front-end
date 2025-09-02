// Simplified ProductPage.js
import React, { useState, useEffect } from 'react';
import { productService, apiUtils } from '../services/apiService';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '', price: '', category: '', stock: '', description: ''
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.name || !formData.price || !formData.category || !formData.stock) {
        setError('Please fill in all required fields');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        setSuccess('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        setSuccess('Product created successfully!');
      }

      resetForm();
      loadProducts();
      
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    }
  };

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

  const handleDelete = async (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      try {
        await productService.deleteProduct(product.id);
        setSuccess('Product deleted successfully!');
        loadProducts();
      } catch (err) {
        setError(apiUtils.formatErrorMessage(err));
      }
    }
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Product Management</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Add, edit, and manage your product inventory
      </p>

      {/* Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Form */}
      <div className="form-container">
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
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

            <div className="form-group">
              <label>Category *</label>
              <select
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
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
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

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div>
        <h2>Products ({products.length})</h2>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="alert alert-info">
            No products found. Add your first product above.
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td><strong>{product.name}</strong></td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.category}</td>
                  <td>
                    <span style={{ color: product.stock < 10 ? '#e74c3c' : '#27ae60' }}>
                      {product.stock}
                      {product.stock < 10 && ' ⚠️'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(product)}
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

      {/* Simple Stats */}
      {products.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '1.5rem', color: '#3498db' }}>
              {products.length}
            </strong>
            <p>Total Products</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '1.5rem', color: '#27ae60' }}>
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </strong>
            <p>Total Stock</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '1.5rem', color: '#e74c3c' }}>
              {products.filter(p => p.stock < 10).length}
            </strong>
            <p>Low Stock</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;