// App.js - Main React Application Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import components
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import AttendantPage from './components/AttendantPage';

/**
 * Main App Component
 * Handles routing and navigation for the full-stack application
 * 
 * Course: IX608001 Intermediate Application Development Concepts
 * Assignment: Practical 4 - Full Stack Application
 * Institution: Otago Polytechnic Auckland International Campus
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* Application Header */}
        <header className="app-header">
          <h1>Practical 4 - Full Stack Application</h1>
          <p>Spring Boot Backend + React Frontend</p>
          <p>IX608001 Intermediate Application Development Concepts</p>
        </header>

        {/* Navigation Menu */}
        <nav className="navbar">
          <Link to="/" className="nav-link">
            🏠 Home
          </Link>
          <Link to="/products" className="nav-link">
            📦 Products
          </Link>
          <Link to="/attendants" className="nav-link">
            👥 Attendants
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/attendants" element={<AttendantPage />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <div className="page-container">
                <h1 className="page-title">404 - Page Not Found</h1>
                <p className="page-description">
                  The page you're looking for doesn't exist.
                </p>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Link to="/" className="btn btn-primary">
                    Return to Home
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* Application Footer */}
        <footer className="app-footer">
          <p>© 2025 Otago Polytechnic Auckland International Campus</p>
          <p>IX608001 Intermediate Application Development Concepts - Practical 4</p>
          <p>Full Stack Application: Spring Boot + React + H2 Database</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;