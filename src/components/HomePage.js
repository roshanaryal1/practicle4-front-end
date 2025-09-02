// HomePage.js - Welcome page component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiUtils } from '../services/apiService';

const HomePage = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');

  // Test backend connection on component mount
  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
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
          <strong>Testing backend connection...</strong>
          <div className="loading-spinner"></div>
        </div>
      );
    }
    
    if (connectionStatus === 'connected') {
      return (
        <div className="alert alert-success">
          <strong>✓ Backend Connected</strong> - Spring Boot application is running successfully!
        </div>
      );
    }
    
    return (
      <div className="alert alert-error">
        <strong>✗ Backend Disconnected</strong> - Please ensure Spring Boot application is running on port 8080.
        <br />
        <button className="btn btn-secondary" onClick={testBackendConnection} style={{ marginTop: '10px' }}>
          Test Connection Again
        </button>
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome to Practical 4</h1>
        <p className="welcome-text">
          Full-Stack Application Development with Spring Boot & React
        </p>
        <p className="welcome-text">
          IX608001 Intermediate Application Development Concepts
        </p>
      </div>

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Application Overview */}
      <div className="page-container">
        <h2 className="page-title">Application Overview</h2>
        <p className="page-description">
          This full-stack web application demonstrates modern development practices using 
          Spring Boot for the backend REST API and React for the frontend user interface. 
          The application manages Products and Attendants with complete CRUD (Create, Read, Update, Delete) operations.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Product Management</h3>
          <p>
            Manage your product inventory with full CRUD operations. 
            Add new products, update existing ones, view all products in a table format, 
            and delete products when needed.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            Manage Products
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Attendant Management</h3>
          <p>
            Manage staff attendants with comprehensive information tracking. 
            Store names, addresses, contact details, and additional comments 
            for each team member.
          </p>
          <Link to="/attendants" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            Manage Attendants
          </Link>
        </div>
      </div>

      {/* Technical Features */}
      <div className="page-container" style={{ marginTop: '2rem' }}>
        <h2 className="page-title">Technical Features</h2>
        <div className="features-grid">
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px' }}>
            <h4>Backend Technologies</h4>
            <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
              <li>Spring Boot 3.1.0</li>
              <li>Spring Data JPA</li>
              <li>H2 In-Memory Database</li>
              <li>RESTful API Design</li>
              <li>Maven Build System</li>
            </ul>
          </div>
          
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px' }}>
            <h4>Frontend Technologies</h4>
            <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
              <li>React 18.2.0</li>
              <li>React Router DOM</li>
              <li>Axios HTTP Client</li>
              <li>Modern CSS3</li>
              <li>Responsive Design</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="page-container" style={{ marginTop: '2rem', background: '#e8f4f8' }}>
        <h3>🔗 API Endpoints</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h4>Product APIs</h4>
            <ul style={{ fontSize: '0.9rem', textAlign: 'left' }}>
              <li>GET /api/products</li>
              <li>POST /api/products</li>
              <li>PUT /api/products/{'{id}'}</li>
              <li>DELETE /api/products/{'{id}'}</li>
            </ul>
          </div>
          <div>
            <h4>Attendant APIs</h4>
            <ul style={{ fontSize: '0.9rem', textAlign: 'left' }}>
              <li>GET /api/attendants</li>
              <li>POST /api/attendants</li>
              <li>PUT /api/attendants/{'{id}'}</li>
              <li>DELETE /api/attendants/{'{id}'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Database Information */}
      <div className="page-container" style={{ marginTop: '2rem', background: '#fff3cd' }}>
        <h3>🗄️ Database Console</h3>
        <p>
          You can access the H2 database console to view data directly:
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>URL:</strong> <a href="http://localhost:8080/practical4-backend/h2-console" target="_blank" rel="noopener noreferrer">
            http://localhost:8080/practical4-backend/h2-console
          </a>
        </p>
        <p>
          <strong>JDBC URL:</strong> jdbc:h2:mem:testdb<br />
          <strong>Username:</strong> sa<br />
          <strong>Password:</strong> password
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="page-container" style={{ marginTop: '2rem' }}>
        <h3>🚀 Quick Start Guide</h3>
        <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>Ensure your Spring Boot backend is running on port 8080</li>
          <li>Click "Manage Products" to add, edit, or delete products</li>
          <li>Click "Manage Attendants" to manage staff information</li>
          <li>Use the H2 console link above to view database tables directly</li>
          <li>All changes are automatically saved to the database</li>
        </ol>
      </div>

      {/* Student Information */}
      <div className="page-container" style={{ marginTop: '2rem', background: '#e7f3ff', border: '2px solid #b3d9ff' }}>
        <h3>📚 Assignment Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', textAlign: 'left' }}>
          <div>
            <strong>Course:</strong> IX608001<br />
            <strong>Assignment:</strong> Practical 4<br />
            <strong>Due Date:</strong> Tuesday 2nd September 8:30am<br />
            <strong>Weight:</strong> 5% of final marks
          </div>
          <div>
            <strong>Student:</strong> [Your Name Here]<br />
            <strong>Institution:</strong> Otago Polytechnic<br />
            <strong>Campus:</strong> Auckland International<br />
            <strong>Lecturer:</strong> Tariq Khan
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;