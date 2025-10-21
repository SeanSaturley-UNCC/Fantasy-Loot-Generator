import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as GenerateLoot } from './Pages/GenerateLoot';
import Login from './Pages/Login';
import './App.css'

export const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<GenerateLoot />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
