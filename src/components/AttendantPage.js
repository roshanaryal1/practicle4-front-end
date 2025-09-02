// AttendantPage.js - Attendant management component
import React, { useState, useEffect } from 'react';
import { attendantService } from '../services/apiService';
import { apiUtils } from '../services/apiService';

const AttendantPage = () => {
  // State management
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAttendant, setEditingAttendant] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    email: '',
    comments: ''
  });

  // Load attendants when component mounts
  useEffect(() => {
    loadAttendants();
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

  // Load all attendants from backend
  const loadAttendants = async () => {
    try {
      setLoading(true);
      const data = await attendantService.getAllAttendants();
      setAttendants(data);
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
      address: '',
      mobile: '',
      email: '',
      comments: ''
    });
    setEditingAttendant(null);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Validate mobile number format
  const isValidMobile = (mobile) => {
    const cleanMobile = mobile.replace(/[\s-]/g, '');
    return /^[0-9+]{7,15}$/.test(cleanMobile);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic form validation
      if (!formData.name.trim()) {
        setError('Attendant name is required');
        return;
      }

      // Email validation (if provided)
      if (formData.email && !isValidEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Mobile validation (if provided)
      if (formData.mobile && !isValidMobile(formData.mobile)) {
        setError('Please enter a valid mobile number (7-15 digits)');
        return;
      }

      // Prepare attendant data
      const attendantData = {
        ...formData,
        name: formData.name.trim(),
        address: formData.address.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        comments: formData.comments.trim()
      };

      if (editingAttendant) {
        // Update existing attendant
        await attendantService.updateAttendant(editingAttendant.id, attendantData);
        setSuccess('Attendant updated successfully!');
      } else {
        // Create new attendant
        await attendantService.createAttendant(attendantData);
        setSuccess('Attendant created successfully!');
      }

      // Reset form and reload data
      resetForm();
      loadAttendants();
      
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    }
  };

  // Handle edit button click
  const handleEdit = (attendant) => {
    setFormData({
      name: attendant.name || '',
      address: attendant.address || '',
      mobile: attendant.mobile || '',
      email: attendant.email || '',
      comments: attendant.comments || ''
    });
    setEditingAttendant(attendant);
  };

  // Handle delete button click
  const handleDelete = async (attendant) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${attendant.name}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await attendantService.deleteAttendant(attendant.id);
        setSuccess('Attendant deleted successfully!');
        loadAttendants();
      } catch (err) {
        setError(apiUtils.formatErrorMessage(err));
      }
    }
  };

  // Format mobile number for display
  const formatMobile = (mobile) => {
    if (!mobile) return 'Not provided';
    return mobile;
  };

  // Format email for display
  const formatEmail = (email) => {
    if (!email) return 'Not provided';
    return email;
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Attendant Management</h1>
      <p className="page-description">
        Manage staff attendants and their information. Keep track of contact details and additional notes.
      </p>

      {/* Success/Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Attendant Form */}
      <div className="form-container">
        <h2>{editingAttendant ? 'Edit Attendant' : 'Add New Attendant'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            
            {/* Attendant Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
              />
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className="form-control"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="+64 21 123 4567"
              />
            </div>
          </div>

          {/* Address (full width) */}
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
            />
          </div>

          {/* Comments (full width) */}
          <div className="form-group">
            <label htmlFor="comments">Comments/Notes</label>
            <textarea
              id="comments"
              name="comments"
              className="form-control"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Additional notes about the attendant..."
              rows="3"
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingAttendant ? 'Update Attendant' : 'Add Attendant'}
            </button>
            {editingAttendant && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Attendants Table */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Attendant List ({attendants.length} attendants)</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner"></div>
            <p>Loading attendants...</p>
          </div>
        ) : attendants.length === 0 ? (
          <div className="alert alert-info">
            No attendants found. Add your first attendant using the form above.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendants.map((attendant) => (
                <tr key={attendant.id}>
                  <td>{attendant.id}</td>
                  <td>
                    <strong>{attendant.name}</strong>
                  </td>
                  <td>
                    {attendant.email ? (
                      <a href={`mailto:${attendant.email}`} style={{ color: '#3498db', textDecoration: 'none' }}>
                        {attendant.email}
                      </a>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>
                    )}
                  </td>
                  <td>
                    {attendant.mobile ? (
                      <a href={`tel:${attendant.mobile}`} style={{ color: '#27ae60', textDecoration: 'none' }}>
                        {formatMobile(attendant.mobile)}
                      </a>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>
                    )}
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    {attendant.address ? (
                      <span title={attendant.address}>
                        {attendant.address.length > 50 
                          ? attendant.address.substring(0, 50) + '...'
                          : attendant.address
                        }
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>
                    )}
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    {attendant.comments ? (
                      <span title={attendant.comments}>
                        {attendant.comments.length > 50 
                          ? attendant.comments.substring(0, 50) + '...'
                          : attendant.comments
                        }
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>No comments</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(attendant)}
                        title="Edit Attendant"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(attendant)}
                        title="Delete Attendant"
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
      {attendants.length > 0 && (
        <div className="page-container" style={{ marginTop: '2rem', background: '#f8f9fa' }}>
          <h3>👥 Attendant Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#3498db' }}>
                {attendants.length}
              </strong>
              <p>Total Attendants</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#27ae60' }}>
                {attendants.filter(a => a.email).length}
              </strong>
              <p>With Email</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#e74c3c' }}>
                {attendants.filter(a => a.mobile).length}
              </strong>
              <p>With Mobile</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '2rem', color: '#9b59b6' }}>
                {attendants.filter(a => a.address).length}
              </strong>
              <p>With Address</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information Display */}
      {attendants.length > 0 && (
        <div className="page-container" style={{ marginTop: '2rem', background: '#e8f5e8' }}>
          <h3>📋 Quick Contact List</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {attendants.filter(a => a.email || a.mobile).map(attendant => (
              <div key={attendant.id} style={{ 
                background: 'white', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                  {attendant.name}
                </strong>
                {attendant.email && (
                  <div style={{ marginBottom: '0.25rem' }}>
                    📧 <a href={`mailto:${attendant.email}`}>{attendant.email}</a>
                  </div>
                )}
                {attendant.mobile && (
                  <div>
                    📱 <a href={`tel:${attendant.mobile}`}>{attendant.mobile}</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendantPage;