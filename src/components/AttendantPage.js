// Simplified AttendantPage.js
import React, { useState, useEffect } from 'react';
import { attendantService, apiUtils } from '../services/apiService';

const AttendantPage = () => {
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAttendant, setEditingAttendant] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    email: '',
    comments: ''
  });

  useEffect(() => {
    loadAttendants();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '', address: '', mobile: '', email: '', comments: ''
    });
    setEditingAttendant(null);
  };

  const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.name.trim()) {
        setError('Attendant name is required');
        return;
      }

      if (formData.email && !isValidEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      const attendantData = {
        ...formData,
        name: formData.name.trim(),
        address: formData.address.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        comments: formData.comments.trim()
      };

      if (editingAttendant) {
        await attendantService.updateAttendant(editingAttendant.id, attendantData);
        setSuccess('Attendant updated successfully!');
      } else {
        await attendantService.createAttendant(attendantData);
        setSuccess('Attendant created successfully!');
      }

      resetForm();
      loadAttendants();
      
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    }
  };

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

  const handleDelete = async (attendant) => {
    if (window.confirm(`Delete "${attendant.name}"?`)) {
      try {
        await attendantService.deleteAttendant(attendant.id);
        setSuccess('Attendant deleted successfully!');
        loadAttendants();
      } catch (err) {
        setError(apiUtils.formatErrorMessage(err));
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Attendant Management</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Manage staff attendants and their contact information
      </p>

      {/* Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Form */}
      <div className="form-container">
        <h2>{editingAttendant ? 'Edit Attendant' : 'Add New Attendant'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                className="form-control"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="+64 21 123 4567"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
            />
          </div>

          <div className="form-group">
            <label>Comments/Notes</label>
            <textarea
              name="comments"
              className="form-control"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Additional notes..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingAttendant ? 'Update Attendant' : 'Add Attendant'}
            </button>
            {editingAttendant && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Attendants List */}
      <div>
        <h2>Attendants ({attendants.length})</h2>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading attendants...</p>
          </div>
        ) : attendants.length === 0 ? (
          <div className="alert alert-info">
            No attendants found. Add your first attendant above.
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendants.map((attendant) => (
                <tr key={attendant.id}>
                  <td>{attendant.id}</td>
                  <td><strong>{attendant.name}</strong></td>
                  <td>
                    {attendant.email ? (
                      <a href={`mailto:${attendant.email}`}>
                        {attendant.email}
                      </a>
                    ) : (
                      <span style={{ color: '#999' }}>Not provided</span>
                    )}
                  </td>
                  <td>
                    {attendant.mobile ? (
                      <a href={`tel:${attendant.mobile}`}>
                        {attendant.mobile}
                      </a>
                    ) : (
                      <span style={{ color: '#999' }}>Not provided</span>
                    )}
                  </td>
                  <td>
                    {attendant.address ? (
                      <span title={attendant.address}>
                        {attendant.address.length > 30 
                          ? attendant.address.substring(0, 30) + '...'
                          : attendant.address
                        }
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>Not provided</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(attendant)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(attendant)}
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
      {attendants.length > 0 && (
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
              {attendants.length}
            </strong>
            <p>Total Attendants</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '1.5rem', color: '#27ae60' }}>
              {attendants.filter(a => a.email).length}
            </strong>
            <p>With Email</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: '1.5rem', color: '#9b59b6' }}>
              {attendants.filter(a => a.mobile).length}
            </strong>
            <p>With Mobile</p>
          </div>
        </div>
      )}

      {/* Contact List */}
      {attendants.length > 0 && (
        <div className="page-container" style={{ marginTop: '2rem', background: '#e8f5e8' }}>
          <h3>📞 Quick Contact List</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {attendants.filter(a => a.email || a.mobile).map(attendant => (
              <div key={attendant.id} style={{ 
                background: 'white', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <strong>{attendant.name}</strong>
                {attendant.email && (
                  <div>📧 <a href={`mailto:${attendant.email}`}>{attendant.email}</a></div>
                )}
                {attendant.mobile && (
                  <div>📱 <a href={`tel:${attendant.mobile}`}>{attendant.mobile}</a></div>
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