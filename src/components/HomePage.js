// Simplified HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiUtils } from '../services/apiService';

const HomePage = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const result = await apiUtils.testConnection();
      setConnectionStatus(result.success ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const ConnectionStatus = () => {
    if (connectionStatus === 'testing') {
      return (
        <div className="alert alert-info">
          <strong>Testing connection...</strong>
          <div className="loading-spinner"></div>
        </div>
      );
    }
    
    if (connectionStatus === 'connected') {
      return (
        <div className="alert alert-success">
          <strong>✓ Backend Connected</strong> - Spring Boot is running!
        </div>
      );
    }
    
    return (
      <div className="alert alert-error">
        <strong>✗ Backend Disconnected</strong> - Please start Spring Boot on port 8080.
        <br />
        <button className="btn btn-secondary" onClick={testConnection} style={{ marginTop: '10px' }}>
          Try Again
        </button>
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="welcome-card">
        <h1>Welcome to Practical 4</h1>
        <p>Full-Stack Application with Spring Boot & React</p>
        <p>IX608001 Intermediate Application Development Concepts</p>
      </div>

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Features */}
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Product Management</h3>
          <p>Manage products with CRUD operations. Add, edit, view, and delete products.</p>
          <Link to="/products" className="btn btn-primary">
            Manage Products
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Attendant Management</h3>
          <p>Manage staff attendants with contact details and information.</p>
          <Link to="/attendants" className="btn btn-primary">
            Manage Attendants
          </Link>
        </div>
      </div>

      {/* Quick Info */}
      <div className="page-container" style={{ marginTop: '2rem', background: '#f8f9fa' }}>
        <h3>Application Info</h3>
        <p><strong>Backend:</strong> Spring Boot 3.1.0 + H2 Database</p>
        <p><strong>Frontend:</strong> React 18+ with React Router</p>
        <p><strong>Database Console:</strong> 
          <a href="http://localhost:8080/practical4-backend/h2-console" target="_blank" rel="noopener noreferrer">
            H2 Console
          </a>
        </p>
        <p><strong>API Base:</strong> http://localhost:8080/practical4-backend/api</p>
      </div>

      {/* Assignment Info */}
      <div className="page-container" style={{ marginTop: '2rem', background: '#e3f2fd' }}>
        <h3>Assignment Details</h3>
        <p><strong>Course:</strong> IX608001 | <strong>Assignment:</strong> Practical 4</p>
        <p><strong>Due:</strong> Tuesday 2nd September 8:30am | <strong>Weight:</strong> 5%</p>
        <p><strong>Student:</strong> [Your Name] | <strong>Lecturer:</strong> Tariq Khan</p>
      </div>
    </div>
  );
};

export default HomePage;