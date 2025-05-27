import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Components


// Import Pages
import VisitorForm from './pages/VisitorForm';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import 'react-datepicker/dist/react-datepicker.css';

import './App.css';

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visitor-registration" element={<VisitorForm />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

