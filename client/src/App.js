import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import LoginForm from './components/LoginForm'; // Rename the existing Login.js to LoginForm.js
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default App;